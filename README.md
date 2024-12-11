# Stacks

- RedwoodJS
- Puppeteer
- Docker
- PostgreSQL

# database and models

1. define schema
2. docker compose postgres
3. define db services
4. seed data

# achieve the core function of the crawler

## website config
example: api/src/services/scraper-config/okx.ts
```typescript
import { IBlogConfig } from '.'

export const okxConfig: IBlogConfig = {
  name: 'okx',
  baseUrl: 'https://www.okx.com',
  indexPage: '/learn',
  selectors: {
    articleLinks: '.index_postItemContainer__iYw6t a',
    nextPage: 'button[class*="cds-button-"][class*="cds-primaryForeground-"]',
    title: '.index_title__0XdIR',
    content: '.rich-text',
    date: '.index_date__IHysu',
  },
  pagination: {
    type: 'button',
    maxPages: 3,
  },
}
```
## test

```typescript
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
```

## avoid duplicate content:
```typescript
// find existing articles
const existingArticles = await articles.findByUrls(limitedLinks)
const existingUrls = new Set(existingArticles.map((a) => a.url))
const newLinks = limitedLinks.filter((url) => !existingUrls.has(url))

// scrape new articles
for (const url of newLinks) {
  await errorHandler.retry(() => blogScraper.scrapeArticle(url, config), {
    maxRetries: 3,
    delay: 2000,
  })
}
```

# CI/CD



# develop the front-end interface

