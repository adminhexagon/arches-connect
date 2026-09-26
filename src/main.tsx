import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { AppStateProvider } from './state/AppState'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing root element')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </BrowserRouter>
  </StrictMode>,
)
