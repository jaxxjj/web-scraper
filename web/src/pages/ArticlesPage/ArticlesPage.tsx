import { useState } from 'react'

import { Container, Grid, Box, Typography } from '@mui/material'

import { MetaTags } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'

import ArticleCard from 'src/components/ArticleCard/ArticleCard'
import EmptyState from 'src/components/EmptyState/EmptyState'
import SourceTabs from 'src/components/SourceTabs/SourceTabs'

const ARTICLES_QUERY = gql`
  query ArticlesQuery {
    articles {
      id
      title
      source
      date
      status
      createdAt
      content
    }
  }
`

const SOURCES = ['okx', 'coinbase']

const ArticlesPage = () => {
  const { data, loading, error } = useQuery(ARTICLES_QUERY)
  const [currentSource, setCurrentSource] = useState(SOURCES[0])

  if (loading)
    return (
      <Container>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    )

  if (error)
    return (
      <Container>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="error">Error: {error.message}</Typography>
        </Box>
      </Container>
    )

  const filteredArticles = data.articles.filter(
    (article) => article.source === currentSource
  )

  return (
    <>
      <MetaTags title="Crypto News" description="Latest crypto news" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Latest News
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Stay updated with the latest from {currentSource.toUpperCase()}
          </Typography>
        </Box>

        <SourceTabs
          sources={SOURCES}
          currentSource={currentSource}
          onSourceChange={setCurrentSource}
        />

        {filteredArticles.length > 0 ? (
          <Grid container spacing={3}>
            {filteredArticles.map((article) => (
              <Grid item xs={12} md={6} key={article.id}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState source={currentSource} />
        )}
      </Container>
    </>
  )
}

export default ArticlesPage
