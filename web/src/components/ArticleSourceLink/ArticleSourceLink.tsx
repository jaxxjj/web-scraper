import { Launch as LaunchIcon } from '@mui/icons-material'
import { Box, Button } from '@mui/material'

interface ArticleSourceLinkProps {
  url: string
}

const ArticleSourceLink = ({ url }: ArticleSourceLinkProps) => {
  return (
    <Box sx={{ my: 3 }}>
      <Button
        variant="outlined"
        endIcon={<LaunchIcon />}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Original Article
      </Button>
    </Box>
  )
}

export default ArticleSourceLink
