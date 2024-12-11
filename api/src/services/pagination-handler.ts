import { Page } from 'puppeteer-core'

import { delay } from './utils'

export const paginationHandler = {
  // 处理传统分页
  handlePagination: async (page: Page, selector: string): Promise<boolean> => {
    try {
      console.log('Looking for Show More button:', selector)

      // 1. 先等待按钮出现
      await page.waitForSelector(selector, { timeout: 5000 })

      // 2. 检查按钮是否存在
      const nextButton = await page.$(selector)
      if (!nextButton) {
        console.log('No Show More button found, selector:', selector)
        // 输出页面上所有按钮的信息，帮助调试
        const buttons = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button')).map((btn) => ({
            text: btn.textContent,
            dataQa: btn.getAttribute('data-qa'),
            className: btn.className,
          }))
        })
        console.log('页面上的所有按钮:', buttons)
        return false
      }

      console.log('Found Show More button')

      // 3. 检查按钮是否可见和可点击
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

      // 4. 记录当前文章数量
      const currentArticles = await page.evaluate((articleSelector) => {
        return document.querySelectorAll(articleSelector).length
      }, '[data-qa^="Wayfinding-Child"][data-qa$="-CardHeader"]')

      // 5. 点击按钮
      await nextButton.click()
      await delay(2000)

      // 6. 等待新文章加载 (最多等待10秒)
      let attempts = 0
      const maxAttempts = 10
      while (attempts < maxAttempts) {
        const newArticlesCount = await page.evaluate((articleSelector) => {
          return document.querySelectorAll(articleSelector).length
        }, '[data-qa^="Wayfinding-Child"][data-qa$="-CardHeader"]')

        if (newArticlesCount > currentArticles) {
          console.log(`加载了新文章: ${newArticlesCount - currentArticles} 篇`)
          return true
        }

        await delay(1000)
        attempts++
      }

      console.log('没有检测到新文章加载')
      return false
    } catch (error) {
      console.log('分页处理错误:', error)
      return false
    }
  },

  // 处理无限滚动
  handleInfiniteScroll: async (
    page: Page,
    options = { maxScrolls: 10 }
  ): Promise<void> => {
    let previousHeight = 0
    let scrollCount = 0

    while (scrollCount < options.maxScrolls) {
      // 获取当前页面高度，明确指定返回类型为number
      const currentHeight = await page.evaluate(() => {
        return document.body.scrollHeight as number
      })

      if (currentHeight === previousHeight) {
        break
      }

      // 滚动到底部
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await delay(1000 + Math.random() * 1000)

      previousHeight = currentHeight
      scrollCount++
    }
  },
}
