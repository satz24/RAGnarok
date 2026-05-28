import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function normalizeBase(base: string) {
  if (!base || base === '/') return '/'
  return base.endsWith('/') ? base : `${base}/`
}

// Default "/" for Vercel/local. GitHub Actions sets VITE_BASE_PATH=/RAGnarok/
export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE_PATH ?? '/'),
  plugins: [react(), tailwindcss()],
})
