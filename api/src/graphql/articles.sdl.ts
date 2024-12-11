export const schema = gql`
  type Article {
    id: String!
    url: String!
    title: String!
    content: String
    date: DateTime
    source: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    articles: [Article!]! @requireAuth
    article(id: String!): Article @requireAuth
    articlesBySource(source: String!): [Article!]! @requireAuth
    recentArticles: [Article!]! @requireAuth
  }
`
