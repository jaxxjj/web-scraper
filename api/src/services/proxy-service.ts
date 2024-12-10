import { Page } from 'puppeteer-core'

interface ScrapingBrowserConfig {
  browserWSEndpoint: string
}

export const proxyService = {
  // get Scraping Browser config
  getScrapingBrowser: (): ScrapingBrowserConfig => {
    const BROWSER_WS =
      'wss://brd-customer-hl_4ecc227e-zone-scraping_browser1:o0x912xhvcz1@brd.superproxy.io:9222'
    return {
      browserWSEndpoint: BROWSER_WS,
    }
  },

  // setup page
  setupPage: async (page: Page) => {
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    )
  },
}
