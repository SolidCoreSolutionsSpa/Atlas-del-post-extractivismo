import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './app/routes'
import { RootLayout } from './shared/layout/RootLayout'
import { ThemeProvider } from './shared/hooks/useTheme'
import { Loader } from './shared/ui/Loader'

function App() {
  const [isAppReady, setIsAppReady] = useState(false)

  return (
    <>
      {/* Loader que se muestra hasta que todo esté cargado */}
      <Loader onLoadComplete={() => setIsAppReady(true)} />

      {/* Contenido principal de la app */}
      <BrowserRouter>
        <ThemeProvider>
          <RootLayout isAppReady={isAppReady}>
            <AppRoutes />
          </RootLayout>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App
