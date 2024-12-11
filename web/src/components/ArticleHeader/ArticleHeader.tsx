import { AccessTime as TimeIcon } from '@mui/icons-material'
import { Typography, Box, Chip, Stack } from '@mui/material'

interface ArticleHeaderProps {
  title: string
  source: string
  date?: string
  status: string
}

const ArticleHeader = ({ title, source, date, status }: ArticleHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip
          label={source.toUpperCase()}
          color="primary"
          sx={{ fontWeight: 500 }}
        />
        <Chip
          label={status}
          color={status === 'success' ? 'success' : 'error'}
        />
      </Stack>

      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      {date && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <TimeIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
          <Typography variant="subtitle1">
            {new Date(date).toLocaleDateString()}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ArticleHeader
