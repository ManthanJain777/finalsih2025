import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Correct path now that it's in src
import "../styles/globals.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)