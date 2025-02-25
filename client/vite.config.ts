import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/3
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    global: {}, // Add this line to define 'global'
  },
})
