import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const articles: QueryResolvers['articles'] = () => {
  return db.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export const article: QueryResolvers['article'] = ({ id }) => {
  return db.article.findUnique({
    where: { id },
  })
}

export const articlesBySource: QueryResolvers['articlesBySource'] = ({
  source,
}) => {
  return db.article.findMany({
    where: { source },
    orderBy: { createdAt: 'desc' },
  })
}

export const recentArticles: QueryResolvers['recentArticles'] = () => {
  return db.article.findMany({
    where: { status: 'success' },
    orderBy: { date: 'desc' },
    take: 10,
  })
}
