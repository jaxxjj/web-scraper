import {
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
} from '@mui/material'

import { Link, routes } from '@redwoodjs/router'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    source: string
    date?: string
    content?: string
  }
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
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
            display: 'block',
            mb: 2,
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
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.content?.slice(0, 200)}...
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
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
  )
}

export default ArticleCard
