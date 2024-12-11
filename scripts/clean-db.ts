import { db } from 'api/src/lib/db'

export default async function cleanDatabase() {
  console.log('clean database')

  try {
    await db.article.deleteMany()
    console.log('article deleted')
    await db.scrapingJob.deleteMany()
    console.log('scrapingJob deleted')
  } catch (error) {
    console.error('clean database error:', error)
    throw error
  }
}
