import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import pluginRewriteAll from 'vite-plugin-rewrite-all';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),pluginRewriteAll()],
  server:{
    port:3001,
    host:true
  }
})
