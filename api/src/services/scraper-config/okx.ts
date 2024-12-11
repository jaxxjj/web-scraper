import { IBlogConfig } from '.'

export const okxConfig: IBlogConfig = {
  name: 'okx',
  baseUrl: 'https://www.okx.com',
  indexPage: '/learn/category/blog',
  selectors: {
    // article list page
    articleLinks:
      'a.academy.academy-powerLink-a11y.academy-powerLink[class*="layout"][href^="/learn"]',
    nextPage: '.academy-pagination a[href*="page"]',
    // article detail page
    title: 'h1',
    content:
      'div[class*="contentRichTextContainer"] p, div[class*="contentRichTextContainer"] li',
    date: 'div[class*="updatedTime"]',
    contentContainers: ['div[class*="contentRichTextContainer"]'], // OKX 特定的内容容器选择器
  },
  pagination: {
    type: 'button',
    maxPages: 3,
  },
}
