import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

if (import.meta.env.DEV) {
  const [React, axe, ReactDOM] = await Promise.all([
    import('react'),
    import('@axe-core/react'),
    import('react-dom'),
  ]);
  axe.default(React, ReactDOM.default, 1000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
