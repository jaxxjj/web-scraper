import { Container, Paper, Box, Divider } from '@mui/material'

import { MetaTags } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'

import ArticleContent from 'src/components/ArticleContent/ArticleContent'
import ArticleHeader from 'src/components/ArticleHeader/ArticleHeader'
import ArticleSourceLink from 'src/components/ArticleSourceLink/ArticleSourceLink'

const ARTICLE_QUERY = gql`
  query ArticleQuery($id: String!) {
    article(id: $id) {
      id
      title
      content
      source
      date
      url
      status
      createdAt
    }
  }
`

const ArticlePage = ({ id }) => {
  const { data, loading, error } = useQuery(ARTICLE_QUERY, {
    variables: { id },
  })

  if (loading)
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>Loading...</Box>
      </Container>
    )

  if (error)
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center', color: 'error.main' }}>
          Error: {error.message}
        </Box>
      </Container>
    )

  const { article } = data

  return (
    <>
      <MetaTags title={article.title} description={article.title} />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          <ArticleHeader
            title={article.title}
            source={article.source}
            date={article.date}
            status={article.status}
          />

          <ArticleSourceLink url={article.url} />

          <Divider sx={{ my: 4 }} />

          <ArticleContent content={article.content} />
        </Paper>
      </Container>
    </>
  )
}

export default ArticlePage
