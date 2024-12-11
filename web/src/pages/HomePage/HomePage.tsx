import { Container, Typography, Box, Button } from '@mui/material'

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to RedwoodJS
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Card 1</h2>
            <p className="text-gray-600">This is styled with Tailwind CSS</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Card 2</h2>
            <p className="text-white">Gradient background with Tailwind</p>
          </div>

          <div className="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Card 3</h2>
            <p className="text-gray-600">Hover effects with Tailwind</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            variant="contained"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
          >
            Tailwind + MUI Button
          </Button>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Pure Tailwind Button
          </button>
        </div>
      </Box>
    </Container>
  )
}

export default HomePage
