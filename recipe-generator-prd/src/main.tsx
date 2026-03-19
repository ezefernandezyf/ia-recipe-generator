import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './index.css';

function getRootElement(): HTMLElement {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  return rootElement;
}

const rootElement = getRootElement();
const root: ReturnType<typeof createRoot> = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);