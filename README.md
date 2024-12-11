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

## scraper script
Example: okx

```typescript
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
    contentContainers: ['div[class*="contentRichTextContainer"]'],
    excludeClasses: ['index_disclaimerContainer__5w-ON'],
  },
  pagination: {
    type: 'button',
    maxPages: 3,
  },
}
```


```bash
[STARTED] Generating Prisma client
[COMPLETED] Generating Prisma client
[STARTED] Running script
start testing OKX blog scraping...
config: {
  name: 'okx',
  baseUrl: 'https://www.okx.com/learn/category/blog',
  pagination: 'button',
  maxPages: 3
}

start scraping article list...
Connecting to Scraping Browser...
Visiting: https://www.okx.com/learn/category/blog
Looking for Show More button: .academy-pagination a[href*="page"]
Found Show More button
no new articles loaded
scraping article: https://www.okx.com/learn/okx-wallet-dex-modes
scraping article: https://www.okx.com/learn/okx-proof-of-reserves-25
scraping article: https://www.okx.com/learn/okx-belgium-launch
scraping article: https://www.okx.com/learn/okx-dex-api-phantom
scraping article: https://www.okx.com/learn/okx-forteus-regulated-custody
scraping article: https://www.okx.com/learn/okx-smart-picks
scraping article: https://www.okx.com/learn/okx-creators-collective

result: { total: 24, new: 7, existing: 3 }
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

local test workflow:

```bash
act -W .github/workflows/test.yml \
    --container-architecture linux/amd64 \
    --bind \
    -v \
    -P ubuntu-latest=catthehacker/ubuntu:act-latest
```

# develop the front-end interface

