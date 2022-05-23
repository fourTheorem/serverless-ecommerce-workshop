import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App'
import { SettingsContext, defaultSettings } from './settings'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsContext.Provider value={defaultSettings}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SettingsContext.Provider>
  </React.StrictMode>
)
