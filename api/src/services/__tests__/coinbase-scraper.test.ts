import { Browser } from 'puppeteer-core'

import { blogScraper } from '../blog-scraper'
import { coinbaseConfig } from '../scraper-config/coinbase'

describe('Coinbase Blog Scraper Integration Tests', () => {
  jest.setTimeout(120000)

  const browser: Browser | null = null

  beforeAll(async () => {
    // if any pre settings
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
  })

  it('should scrape Coinbase article list', async () => {
    console.log('start testing Coinbase blog scraping...')

    try {
      console.log('config:', {
        name: coinbaseConfig.name,
        baseUrl: `${coinbaseConfig.baseUrl}${coinbaseConfig.indexPage}`,
        pagination: coinbaseConfig.pagination.type,
        maxPages: coinbaseConfig.pagination.maxPages,
      })

      console.log('\nstart scraping article list...')
      const result = await blogScraper.scrapeArticleList(coinbaseConfig, 3)

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

  // Optional
  it.skip('should scrape single Coinbase article', async () => {
    console.log('\ntest single article scraping...')
    const testUrl =
      'https://www.coinbase.com/blog/welcome-rob-witoff-to-the-coinbase-exec-team'

    try {
      const article = await blogScraper.scrapeArticle(testUrl, coinbaseConfig)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      expect(article).toBeDefined()
      console.log('Article scraped successfully')
    } catch (error) {
      console.error('test failed:', error)
      throw error
    }
  }, 120000)
})
