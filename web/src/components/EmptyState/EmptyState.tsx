import { Article as ArticleIcon } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
  source: string
}

const EmptyState = ({ source }: EmptyStateProps) => {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <ArticleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography color="text.secondary">
        No articles found from {source.toUpperCase()}
      </Typography>
    </Box>
  )
}

export default EmptyState
