import { useState } from 'react'

import {
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Button,
  Divider,
  useTheme,
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

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

const HomePage = () => {
  const { data, loading, error } = useQuery(ARTICLES_QUERY)
  const [currentSource, setCurrentSource] = useState(SOURCES[0])
  const theme = useTheme()

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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: theme.palette.primary.main,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Crypto News
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Latest updates from major exchanges
          </Typography>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            mb: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 1,
          }}
        >
          <Tabs
            value={SOURCES.indexOf(currentSource)}
            onChange={(_, index) => setCurrentSource(SOURCES[index])}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                py: 2,
              },
            }}
          >
            <Tab
              label="OKX"
              icon={
                <img
                  src="/okx-logo.png"
                  alt="OKX"
                  style={{ width: 24, height: 24 }}
                />
              }
              iconPosition="start"
            />
            <Tab
              label="Coinbase"
              icon={
                <img
                  src="/coinbase-logo.png"
                  alt="Coinbase"
                  style={{ width: 24, height: 24 }}
                />
              }
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Articles Grid */}
        <Grid container spacing={3}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} md={6} key={article.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={article.source.toUpperCase()}
                      color="primary"
                      size="small"
                    />
                    {article.date && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        <TimeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {new Date(article.date).toLocaleDateString()}
                      </Box>
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    component={Link}
                    to={routes.article({ id: article.id })}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {article.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {article.content?.slice(0, 200)}...
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions>
                  <Button
                    component={Link}
                    to={routes.article({ id: article.id })}
                    endIcon={<ArrowIcon />}
                    sx={{ ml: 'auto' }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredArticles.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography color="text.secondary">
              No articles found from {currentSource.toUpperCase()}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default HomePage
