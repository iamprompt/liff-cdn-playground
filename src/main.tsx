import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { LIFFProvider } from './lib/liff/provider'
import App from './App'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NuqsAdapter>
      <LIFFProvider>
        <App />
        <Toaster position="top-center" />
      </LIFFProvider>
    </NuqsAdapter>
  </StrictMode>,
)
