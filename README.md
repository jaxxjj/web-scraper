#

## home page

![Main Page](web/public/main-page.png)

## articles

![Articles Page](web/public/article-page.png)
# Stacks

- RedwoodJS
- Puppeteer
- Docker
- PostgreSQL
- MaterialUI

# database and models

1. define schema
2. docker compose postgres
3. define db services
4. seed data

```prisma

datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:postgres@localhost:5432/web_scraper_dev"
}

generator client {
  provider = "prisma-client-js"
}

// stores blog articles fetched from different sources
// helps track scraping progress and content status
model Article {
  id        String   @id @default(cuid())    // unique id
  url       String   @unique                 // article source url
  title     String                          // article title
  content   String?  @db.Text               // full content, nullable if scrape fails
  date      DateTime?                       // when article was published
  source    String                          // which site it's from (eg: coinbase)
  status    String   @default("pending")    // pending/success/failed
  createdAt DateTime @default(now())        // when we first saw it
  updatedAt DateTime @updatedAt             // last update time
}

// handles proxy configuration for ip rotation
// keeps track of which proxies are working and their health
model Proxy {
  id        String    @id @default(cuid())   // unique id
  host      String                          // proxy host/ip
  port      Int                             // proxy port
  protocol  String    @default("http")      // http/https/socks
  username  String?                         // auth username if needed
  password  String?                         // auth password if needed
  lastUsed  DateTime?                       // last time we used this proxy
  active    Boolean   @default(true)        // is this proxy available
  failCount Int       @default(0)           // how many times it failed
  createdAt DateTime  @default(now())       // when added
  updatedAt DateTime  @updatedAt            // last update
}

// keeps track of scraping jobs and their status
// useful for monitoring and debugging scraping runs
model ScrapingJob {
  id        String    @id @default(cuid())   // unique id
  source    String                          // target website
  status    String    @default("pending")   // pending/running/completed/failed
  startTime DateTime?                       // when job started
  endTime   DateTime?                       // when job finished
  error     String?                         // error message if failed
  createdAt DateTime  @default(now())       // when created
  updatedAt DateTime  @updatedAt            // last update
}
```

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

