import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        cif: resolve(import.meta.dirname, 'work/cif-allocation/index.html'),
        chain: resolve(import.meta.dirname, 'work/challenge-chain/index.html'),
        vi: resolve(import.meta.dirname, 'vi/index.html'),
        viCif: resolve(import.meta.dirname, 'vi/work/cif-allocation/index.html'),
        viChain: resolve(import.meta.dirname, 'vi/work/challenge-chain/index.html'),
      },
    },
  },
})
