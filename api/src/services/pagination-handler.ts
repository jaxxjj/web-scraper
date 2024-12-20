import { Page } from 'puppeteer-core'

import { delay } from './utils'

export const paginationHandler = {
  // deal with pagination
  handlePagination: async (page: Page, selector: string): Promise<boolean> => {
    try {
      console.log('Looking for Show More button:', selector)

      // 1. wait for the button to appear
      await page.waitForSelector(selector, { timeout: 5000 })

      // 2. check if the button exists
      const nextButton = await page.$(selector)
      if (!nextButton) {
        console.log('No Show More button found, selector:', selector)
        // output the information of all buttons on the page, help debug
        const buttons = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button')).map((btn) => ({
            text: btn.textContent,
            dataQa: btn.getAttribute('data-qa'),
            className: btn.className,
          }))
        })
        console.log('all buttons on the page:', buttons)
        return false
      }

      console.log('Found Show More button')

      // 3. check if the button is visible and clickable
      const isVisible = await page.evaluate((sel) => {
        const button = document.querySelector(sel)
        if (!button) return false

        const style = window.getComputedStyle(button)
        return style.display !== 'none' && style.visibility !== 'hidden'
      }, selector)

      if (!isVisible) {
        console.log('Next page button is not visible')
        return false
      }

      // 4. record the current number of articles
      const currentArticles = await page.evaluate((articleSelector) => {
        return document.querySelectorAll(articleSelector).length
      }, '[data-qa^="Wayfinding-Child"][data-qa$="-CardHeader"]')

      // 5. click the button
      await nextButton.click()
      await delay(2000)

      // 6. wait for new articles to load (max wait 10 seconds)
      let attempts = 0
      const maxAttempts = 10
      while (attempts < maxAttempts) {
        const newArticlesCount = await page.evaluate((articleSelector) => {
          return document.querySelectorAll(articleSelector).length
        }, '[data-qa^="Wayfinding-Child"][data-qa$="-CardHeader"]')

        if (newArticlesCount > currentArticles) {
          console.log(
            `loaded new articles: ${newArticlesCount - currentArticles}`
          )
          return true
        }

        await delay(1000)
        attempts++
      }

      console.log('no new articles loaded')
      return false
    } catch (error) {
      console.log('pagination error:', error)
      return false
    }
  },

  // deal with infinite scroll
  handleInfiniteScroll: async (
    page: Page,
    options = { maxScrolls: 10 }
  ): Promise<void> => {
    let previousHeight = 0
    let scrollCount = 0

    while (scrollCount < options.maxScrolls) {
      // get the current page height, explicitly specify the return type as number
      const currentHeight = await page.evaluate(() => {
        return document.body.scrollHeight as number
      })

      if (currentHeight === previousHeight) {
        break
      }

      // scroll to the bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await delay(1000 + Math.random() * 1000)

      previousHeight = currentHeight
      scrollCount++
    }
  },
}
