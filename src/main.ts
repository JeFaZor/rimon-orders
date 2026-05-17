import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Block pinch-zoom and double-tap zoom on iOS Safari (ignores user-scalable=no)
document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())
document.addEventListener('gestureend', e => e.preventDefault())

let lastTouchEnd = 0
document.addEventListener('touchend', e => {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) e.preventDefault()
  lastTouchEnd = now
}, { passive: false })

createApp(App).mount('#app')
