import { blogScraper } from '../api/src/services/blog-scraper'
import { okxConfig } from '../api/src/services/scraper-config/okx'

export default async function testOkxScraper() {
  console.log('start testing OKX blog scraping...')

  try {
    console.log('config:', {
      name: okxConfig.name,
      baseUrl: `${okxConfig.baseUrl}${okxConfig.indexPage}`,
      pagination: okxConfig.pagination.type,
      maxPages: okxConfig.pagination.maxPages,
    })

    // test scraping article list (limit to 10 articles)
    console.log('\nstart scraping article list...')
    const result = await blogScraper.scrapeArticleList(okxConfig, 10)

    console.log('\nresult:', {
      total: result.total,
      new: result.new,
      existing: result.existing,
    })

    // if want to test single article scraping
    /*
    console.log('\ntest single article scraping...')
    const testUrl = 'https://www.okx.com/learn/okx-wallet-alpha-traders'
    await blogScraper.scrapeArticle(testUrl, okxConfig)
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
