import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './app/routes'
import { RootLayout } from './shared/layout/RootLayout'
import { AtlasDataProvider } from './shared/data/AtlasDataContext'

function App() {
  return (
    <AtlasDataProvider>
      <BrowserRouter>
        <RootLayout>
          <AppRoutes />
        </RootLayout>
      </BrowserRouter>
    </AtlasDataProvider>
  )
}

export default App
