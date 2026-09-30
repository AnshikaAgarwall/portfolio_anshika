// App entry point: loads global CSS and mounts <App /> inside the ErrorBoundary
// so even a crash during the first render shows the on-brand error page.
// HelmetProvider lets any page set its <title> and meta tags via <Seo />.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
