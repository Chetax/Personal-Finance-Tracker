import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
    import { CookiesProvider } from 'react-cookie';
    import { UserProvider } from './context/UserContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <BrowserRouter>
    <CookiesProvider>
    <UserProvider>
    <App />
    </UserProvider>
    </CookiesProvider>
    <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>

  </StrictMode>,
)
