import React from 'react'
import ReactDOM from 'react-dom/client'
import AppLocal from './AppLocal'
import './index.css'
import './utils/db-viewer'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppLocal />
  </React.StrictMode>,
)
