import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set document title and language for accessibility
document.title = 'Grammar Master Pro - Learn English Grammar';
document.documentElement.lang = 'es';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);