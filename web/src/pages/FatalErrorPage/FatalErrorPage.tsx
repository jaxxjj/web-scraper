import { Container, Typography, Box, Button } from '@mui/material'

import { Link } from '@redwoodjs/router'

const FatalErrorPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Something went wrong
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          An unexpected error occurred. Please try refreshing the page or
          contact support if the problem persists.
        </Typography>

        <Button variant="contained" color="primary" component={Link} to="/">
          Return Home
        </Button>
      </Box>
    </Container>
  )
}

export default FatalErrorPage
