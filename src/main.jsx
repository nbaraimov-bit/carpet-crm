import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './Sakura/MainApp/App.jsx'

import './index.css'
import "./styles/variables.css" 
import "./styles/layout.css";
import "./Sakura/BottomNavigation/bottomNavigation.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
