import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves at https://<user>.github.io/<repo>/
export default defineConfig({
  base: '/RAGnarok/',
  plugins: [react(), tailwindcss()],
})
