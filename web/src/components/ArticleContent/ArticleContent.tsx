import { Typography, Paper, Box } from '@mui/material'

interface ArticleContentProps {
  content: string | null
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  if (!content) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No content available</Typography>
      </Box>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        '& p': {
          mb: 2,
          lineHeight: 1.8,
          fontSize: '1.1rem',
        },
      }}
    >
      {content.split('\n\n').map((paragraph, index) => (
        <Typography key={index} paragraph>
          {paragraph}
        </Typography>
      ))}
    </Paper>
  )
}

export default ArticleContent
