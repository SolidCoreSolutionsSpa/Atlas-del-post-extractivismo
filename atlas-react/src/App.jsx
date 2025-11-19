import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './app/routes'
import { RootLayout } from './shared/layout/RootLayout'
import { AtlasDataProvider } from './shared/data/AtlasDataContext'
import { AtlasRepositoriesProvider } from './shared/data/AtlasRepositoriesContext'

function App() {
  return (
    <AtlasDataProvider>
      <AtlasRepositoriesProvider>
        <BrowserRouter>
          <RootLayout>
            <AppRoutes />
          </RootLayout>
        </BrowserRouter>
      </AtlasRepositoriesProvider>
    </AtlasDataProvider>
  )
}

export default App
