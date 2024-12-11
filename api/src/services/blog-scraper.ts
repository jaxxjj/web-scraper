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
    console.log(`scraping article: ${url}`)
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
        function cleanText(text) {
          return text ? text.replace(/^\s+|\s+$/g, '') : ''
        }

        // remove exclude classes
        if (sel.excludeClasses) {
          for (let i = 0; i < sel.excludeClasses.length; i++) {
            const elements = document.querySelectorAll(
              `[class*="${sel.excludeClasses[i]}"]`
            )
            for (let j = 0; j < elements.length; j++) {
              elements[j].remove()
            }
          }
        }

        const titleEl = document.querySelector(sel.title)
        const title = titleEl ? cleanText(titleEl.textContent) : ''

        const contentContainers = document.querySelectorAll(
          (sel.contentContainers || ['div[class*="rich-text"]']).join(',')
        )

        let content = ''
        let dateText = ''

        if (contentContainers.length > 0) {
          const parts = []
          const processedTexts = {}

          // iterate over each content container
          for (const container of contentContainers) {
            // get all text elements, including title and paragraphs
            const textElements = container.querySelectorAll(
              'h1, h2, h3, h4, h5, h6, p, li, blockquote, div[class*="text"]'
            )

            for (const el of textElements) {
              // handle title
              const tagName = el.tagName.toLowerCase()
              if (
                tagName === 'h1' ||
                tagName === 'h2' ||
                tagName === 'h3' ||
                tagName === 'h4' ||
                tagName === 'h5' ||
                tagName === 'h6'
              ) {
                const headingText = cleanText(el.textContent)
                if (headingText && !processedTexts[headingText]) {
                  parts.push(`\n## ${headingText}\n`)
                  processedTexts[headingText] = true
                }
                continue
              }

              // handle special text
              const specialEl = el.querySelector('b')
              const specialText = specialEl
                ? cleanText(specialEl.textContent)
                : ''
              const mainText = el.textContent || ''
              const cleanedText = cleanText(mainText.replace(specialText, ''))

              // skip empty content or processed content
              if (!cleanedText || processedTexts[cleanedText]) {
                continue
              }

              if (specialText) {
                const combinedText = `${specialText}: ${cleanedText}`
                if (!processedTexts[combinedText]) {
                  parts.push(combinedText)
                  processedTexts[combinedText] = true
                }
              } else {
                parts.push(cleanedText)
                processedTexts[cleanedText] = true
              }
            }
          }

          content = parts.join('\n\n')
        }

        const dateEl = document.querySelector(sel.date)
        dateText = dateEl ? cleanText(dateEl.textContent) : ''

        return { title, content, dateText }
      }, config.selectors)

      // use formatDate to handle date
      const parsedDate = formatDate(article.dateText)

      // create article data object
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
      console.error(`failed to scrape article ${url}:`, error)
      throw error
    } finally {
      await browser.close()
    }
  },
}
