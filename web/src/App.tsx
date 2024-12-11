import type { ReactNode } from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import './index.css'
import FatalErrorPage from './pages/FatalErrorPage/FatalErrorPage'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RedwoodApolloProvider>{children}</RedwoodApolloProvider>
      </ThemeProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
