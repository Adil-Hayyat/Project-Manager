// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })





import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, // Increase from default 500 KB to 1.5 MB
  },
})
