
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Improved error handling for React 18
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Remove the loading state if it exists
const loadingElement = document.getElementById('loading');
if (loadingElement) {
  loadingElement.remove();
}

// Render with error boundary
root.render(<App />);
