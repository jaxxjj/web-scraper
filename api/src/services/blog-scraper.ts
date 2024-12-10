import { Browser, Page } from 'puppeteer-core'
import puppeteer from 'puppeteer-core'

import { articles } from './db-services'
import { errorHandler } from './error-handler'
import { paginationHandler } from './pagination-handler'
import { proxyService } from './proxy-service'
import { IBlogConfig } from './scraper-config'
import { formatDate } from './utils'

export const blogScraper = {
  scrapeArticleList: async (config: IBlogConfig, limit?: number) => {
    console.log('Connecting to Scraping Browser...')
    const browser: Browser = await puppeteer.connect(
      proxyService.getScrapingBrowser()
    )

    try {
      const page: Page = await browser.newPage()
      await proxyService.setupPage(page)

      console.log(`Visiting: ${config.baseUrl}${config.indexPage}`)
      await page.goto(`${config.baseUrl}${config.indexPage}`, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      })

      const allLinks = new Set<string>()

      if (config.pagination.type === 'infinite-scroll') {
        await paginationHandler.handleInfiniteScroll(page, {
          maxScrolls: config.pagination.maxPages,
        })
      } else {
        let hasMore = true
        let pageCount = 0

        while (
          hasMore &&
          pageCount < (config.pagination.maxPages || Infinity)
        ) {
          // use evaluate to get links
          const links = await page.evaluate((selector) => {
            const elements = document.querySelectorAll(selector)
            const links = []
            for (const el of elements) {
              if (el instanceof HTMLAnchorElement) {
                links.push(el.href)
              }
            }
            return links
          }, config.selectors.articleLinks)

          links.forEach((link) => allLinks.add(link))

          hasMore = await paginationHandler.handlePagination(
            page,
            config.selectors.nextPage || ''
          )
          pageCount++
        }
      }

      const links = Array.from(allLinks)
      const limitedLinks = limit ? links.slice(0, limit) : links

      // find existing articles
      const existingArticles = await articles.findByUrls(limitedLinks)
      const existingUrls = new Set(existingArticles.map((a) => a.url))
      const newLinks = limitedLinks.filter((url) => !existingUrls.has(url))

      // scrape new articles
      for (const url of newLinks) {
        await errorHandler.retry(() => blogScraper.scrapeArticle(url, config), {
          maxRetries: 3,
          delay: 2000,
        })
      }

      return {
        total: links.length,
        new: newLinks.length,
        existing: existingUrls.size,
      }
    } finally {
      await browser.close()
    }
  },

  scrapeArticle: async (url: string, config: IBlogConfig) => {
    console.log(`Scraping article: ${url}`)
    const browser: Browser = await puppeteer.connect(
      proxyService.getScrapingBrowser()
    )

    try {
      const page: Page = await browser.newPage()
      await proxyService.setupPage(page)

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      })

      const article = await page.evaluate((sel) => {
        return {
          title: document.querySelector(sel.title)?.textContent?.trim() || '',
          content:
            document.querySelector(sel.content)?.textContent?.trim() || '',
          dateText: document.querySelector(sel.date)?.textContent?.trim() || '',
        }
      }, config.selectors)

      // use formatDate to handle date
      const parsedDate = formatDate(article.dateText)

      // create article data object, only include date field when it's valid
      const articleData = {
        url,
        source: config.name,
        title: article.title,
        content: article.content,
        status: 'success' as const,
        ...(parsedDate && { date: parsedDate }),
      }

      await articles.create(articleData)
    } catch (error) {
      console.error(`Failed to scrape article ${url}:`, error)
      throw error
    } finally {
      await browser.close()
    }
  },
}
