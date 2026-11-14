import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// De browser kan het installatie-event afvuren voordat React klaar is;
// bewaar het zodat de installatieknop het later kan gebruiken.
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  window.__lhcInstallPrompt = event
  window.dispatchEvent(new Event('lhc-install-available'))
})

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
