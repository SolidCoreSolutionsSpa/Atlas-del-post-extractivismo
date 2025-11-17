import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './app/routes'
import { RootLayout } from './shared/layout/RootLayout'
import { ThemeProvider } from './shared/hooks/useTheme'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <RootLayout>
          <AppRoutes />
        </RootLayout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
