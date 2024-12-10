import { blogScraper } from '../api/src/services/blog-scraper'
import { coinbaseConfig } from '../api/src/services/scraper-config/coinbase'

export default async function testCoinbaseScraper() {
  console.log('start testing Coinbase blog scraping...')

  try {
    console.log('config:', {
      name: coinbaseConfig.name,
      baseUrl: `${coinbaseConfig.baseUrl}${coinbaseConfig.indexPage}`,
      pagination: coinbaseConfig.pagination.type,
      maxPages: coinbaseConfig.pagination.maxPages,
    })

    // test scraping article list (limit to 10 articles)
    console.log('\nstart scraping article list...')
    const result = await blogScraper.scrapeArticleList(coinbaseConfig, 10)

    console.log('\nresult:', {
      total: result.total,
      new: result.new,
      existing: result.existing,
    })

    // if want to test single article scraping
    /*
    console.log('\ntest single article scraping...')
    const testUrl = 'https://www.coinbase.com/blog/welcome-rob-witoff-to-the-coinbase-exec-team'
    await blogScraper.scrapeArticle(testUrl, coinbaseConfig)
    */

    console.log('\ntest completed!')
  } catch (error) {
    console.error('test failed:', error)
    console.error(
      'error details:',
      error instanceof Error ? error.message : String(error)
    )
  }
}
