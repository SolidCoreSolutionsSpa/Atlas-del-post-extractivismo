import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './app/routes'
import { RootLayout } from './shared/layout/RootLayout'

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <AppRoutes />
      </RootLayout>
    </BrowserRouter>
  )
}

export default App
