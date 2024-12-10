import type { Article, Proxy } from '@prisma/client'

import { db } from 'src/lib/db'

// handles all article operations
export const articles = {
  create: (data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    return db.article.create({
      data,
    })
  },

  findByUrl: (url: string) => {
    return db.article.findUnique({
      where: { url },
    })
  },

  updateStatus: (id: string, status: string) => {
    return db.article.update({
      where: { id },
      data: { status },
    })
  },

  list: () => {
    return db.article.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },
}

// handles proxy server operations
export const proxies = {
  // add a new proxy server
  create: (data: Omit<Proxy, 'id' | 'createdAt' | 'updatedAt'>) => {
    return db.proxy.create({
      data,
    })
  },

  // get next available proxy
  // picks one that is: 1. active 2. failed less than 3 times 3. least recently used
  getNext: () => {
    return db.proxy.findFirst({
      where: {
        active: true,
        failCount: { lt: 3 }, // 失败次数小于3次的代理
      },
      orderBy: { lastUsed: 'asc' },
    })
  },

  updateStatus: (id: string, success: boolean) => {
    const newFailCount = success ? 0 : { increment: 1 }

    return db.proxy.update({
      where: { id },
      data: {
        lastUsed: new Date(),
        failCount: newFailCount,
        active: success || false, // 如果成功则active为true，失败则为false
      },
    })
  },
}

// handles scraping job tracking
export const scrapingJobs = {
  create: (source: string) => {
    return db.scrapingJob.create({
      data: { source },
    })
  },

  updateStatus: (id: string, status: string, error?: string) => {
    return db.scrapingJob.update({
      where: { id },
      data: {
        status,
        error,
        ...(status === 'running' ? { startTime: new Date() } : {}),
        ...(status === 'completed' || status === 'failed'
          ? { endTime: new Date() }
          : {}),
      },
    })
  },

  getLastJob: (source: string) => {
    return db.scrapingJob.findFirst({
      where: { source },
      orderBy: { createdAt: 'desc' },
    })
  },
}
