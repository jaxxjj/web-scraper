import { db } from 'api/src/lib/db'

export default async function () {
  try {
    // create test proxies
    await db.proxy.createMany({
      data: [
        {
          host: 'proxy1.example.com',
          port: 8080,
          protocol: 'http',
          username: 'user1',
          password: 'pass1',
        },
        {
          host: 'proxy2.example.com',
          port: 8080,
          protocol: 'https',
          username: 'user2',
          password: 'pass2',
        },
        {
          host: 'proxy3.example.com',
          port: 1080,
          protocol: 'socks5',
        },
      ],
    })

    // create test articles
    await db.article.createMany({
      data: [
        {
          url: 'https://blog.coinbase.com/article-1',
          title: 'article 1',
          content: 'this is a test article',
          source: 'coinbase',
          status: 'completed',
          date: new Date('2024-01-01'),
        },
        {
          url: 'https://blog.coinbase.com/article-2',
          title: 'article 2',
          content: 'this is another test article',
          source: 'coinbase',
          status: 'pending',
        },
      ],
    })

    // create test scraping jobs
    await db.scrapingJob.createMany({
      data: [
        {
          source: 'coinbase',
          status: 'completed',
          startTime: new Date('2024-01-01T10:00:00'),
          endTime: new Date('2024-01-01T10:05:00'),
        },
        {
          source: 'coinbase',
          status: 'failed',
          startTime: new Date('2024-01-01T11:00:00'),
          endTime: new Date('2024-01-01T11:01:00'),
          error: 'proxy connection timeout',
        },
      ],
    })

    console.log('Seeds completed successfully')
  } catch (error) {
    console.warn('Seed error:', error)
    console.error(error)
  }
}
