import { logger } from 'src/lib/logger'
import { blogScraper } from 'src/services/blog-scraper'
import { coinbaseConfig } from 'src/services/scraper-config/coinbase'
import { okxConfig } from 'src/services/scraper-config/okx'

export default async () => {
  try {
    logger.info('Starting scheduled scraping...')

    // Scrape OKX
    logger.info('Scraping OKX blog...')
    const okxResult = await blogScraper.scrapeArticleList(okxConfig, 20)
    logger.info('OKX scraping completed:', {
      total: okxResult.total,
      new: okxResult.new,
      existing: okxResult.existing,
    })

    // Scrape Coinbase
    logger.info('Scraping Coinbase blog...')
    const coinbaseResult = await blogScraper.scrapeArticleList(
      coinbaseConfig,
      20
    )
    logger.info('Coinbase scraping completed:', {
      total: coinbaseResult.total,
      new: coinbaseResult.new,
      existing: coinbaseResult.existing,
    })

    return {
      statusCode: 200,
      body: {
        okx: okxResult,
        coinbase: coinbaseResult,
      },
    }
  } catch (error) {
    logger.error('Scraping failed:', error)
    return {
      statusCode: 500,
      body: { error: error instanceof Error ? error.message : String(error) },
    }
  }
}
