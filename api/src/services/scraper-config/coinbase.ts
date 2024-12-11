import { IBlogConfig } from '../scraper-config'

export const coinbaseConfig: IBlogConfig = {
  name: 'coinbase',
  baseUrl: 'https://www.coinbase.com',
  indexPage: '/blog/landing',
  pagination: {
    type: 'button',
    maxPages: 3,
  },
  selectors: {
    articleLinks: '[data-qa^="Wayfinding-Child"][data-qa$="-CardHeader"]',
    nextPage:
      'button[class*="cds-interactable-"][class*="cds-button-"][class*="cds-primaryForeground-"]',
    title: 'h1[color="foreground"]',
    content: 'div[class*="rich-text"] p',
    date: 'p[color="foregroundMuted"]:last-child',
    category: 'p[color="primary"]',
    contentContainers: [
      'div[class*="rich-text"]',
      'div[id^="article_"]',
      'div[id^="anchor-"]',
    ],
  },
}
