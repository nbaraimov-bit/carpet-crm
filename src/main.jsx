import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import './index.css'
import "./styles/variables.css" 
import "./styles/layout.css";
import "./styles/cards.css";
import "./styles/bottomNavigation.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
