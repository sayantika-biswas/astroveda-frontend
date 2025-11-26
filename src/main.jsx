import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import {AppProvider} from './context/AppContext.jsx';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>,
)
