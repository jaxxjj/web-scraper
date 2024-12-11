export interface IBlogConfig {
  name: string
  baseUrl: string
  indexPage: string
  selectors: {
    articleLinks: string
    title: string
    content: string
    date: string
    nextPage?: string
    category?: string
    contentContainers?: string[]
  }
  pagination: {
    type: 'infinite-scroll' | 'button'
    maxPages?: number
  }
}

export const defaultConfig: IBlogConfig = {
  name: 'coinbase',
  baseUrl: 'https://blog.coinbase.com',
  indexPage: '/',
  selectors: {
    articleLinks: 'article a',
    title: 'h1',
    content: '.article-content',
    date: '.article-date',
    nextPage: '.pagination-next',
    category: '.article-category',
  },
  pagination: {
    type: 'infinite-scroll',
    maxPages: 5,
  },
}

// add more blog configs
export const blogConfigs: Record<string, IBlogConfig> = {
  coinbase: defaultConfig,
  // add more blog configs
}
