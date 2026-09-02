import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        datenZonderSwipen: resolve(__dirname, 'daten-zonder-swipen/index.html'),
        privacyvriendelijkDaten: resolve(__dirname, 'privacyvriendelijk-daten/index.html'),
        swipemoeheid: resolve(__dirname, 'swipemoeheid/index.html'),
      },
      output: {
        manualChunks: {
          supabase: ['@supabase/supabase-js'],
          twilio: ['@twilio/voice-sdk'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
