import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './firebase';
import './styles.css';

function setAppHeight(): void {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

setAppHeight();
window.visualViewport?.addEventListener('resize', setAppHeight);
window.visualViewport?.addEventListener('scroll', setAppHeight);
window.addEventListener('resize', setAppHeight);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
