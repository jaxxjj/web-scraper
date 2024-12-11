import { Browser } from 'puppeteer-core'

import { blogScraper } from '../blog-scraper'
import { okxConfig } from '../scraper-config/okx'

describe('OKX Blog Scraper Integration Tests', () => {
  jest.setTimeout(120000)

  const browser: Browser | null = null

  beforeAll(async () => {})

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
  })

  it('should scrape OKX article list', async () => {
    console.log('start testing OKX blog scraping...')

    try {
      console.log('config:', {
        name: okxConfig.name,
        baseUrl: `${okxConfig.baseUrl}${okxConfig.indexPage}`,
        pagination: okxConfig.pagination.type,
        maxPages: okxConfig.pagination.maxPages,
      })

      console.log('\nstart scraping article list...')
      const result = await blogScraper.scrapeArticleList(okxConfig, 3)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      expect(result).toBeDefined()
      expect(result.total).toBeGreaterThan(0)

      console.log('\nresult:', {
        total: result.total,
        new: result.new,
        existing: result.existing,
      })

      console.log('\ntest completed!')
    } catch (error) {
      console.error('test failed:', error)
      console.error(
        'error details:',
        error instanceof Error ? error.message : String(error)
      )
      throw error
    }
  }, 120000)

  it.skip('should scrape single OKX article', async () => {
    console.log('\ntest single article scraping...')
    const testUrl = 'https://www.okx.com/learn/okx-wallet-alpha-traders'

    try {
      const article = await blogScraper.scrapeArticle(testUrl, okxConfig)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      expect(article).toBeDefined()
      console.log('Article scraped successfully')
    } catch (error) {
      console.error('test failed:', error)
      throw error
    }
  }, 120000)
})
