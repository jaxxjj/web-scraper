import { blogScraper } from './blog-scraper'
import { scrapingJobs } from './db-services'
import { errorHandler } from './error-handler'
import { defaultConfig } from './scraper-config'

export const scheduler = {
  // start scheduled task
  start: () => {
    // run every 6 hours
    setInterval(
      async () => {
        await scheduler.runScraping()
      },
      6 * 60 * 60 * 1000
    )
  },

  // run scraping task
  runScraping: async () => {
    const job = await scrapingJobs.create('scheduled')

    try {
      await scrapingJobs.updateStatus(job.id, 'running')
      await errorHandler.retry(
        async () => await blogScraper.scrapeArticleList(defaultConfig),
        { maxRetries: 3, delay: 5000 }
      )
      await scrapingJobs.updateStatus(job.id, 'completed')
    } catch (error) {
      await scrapingJobs.updateStatus(job.id, 'failed', error.message)
      throw error
    }
  },
}
