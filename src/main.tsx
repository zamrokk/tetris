import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Initialiser l'application React lorsque la page est chargée
window.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
  } else {
    console.error("Élément root non trouvé dans le DOM");
  }
});

console.log('Tetris Game Initialized');
