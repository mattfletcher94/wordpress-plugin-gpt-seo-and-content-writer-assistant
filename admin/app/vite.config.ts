import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    lib: {
      name: 'wpGPTSEOAssistant',
      entry: 'src/main.ts',
      formats: ['iife'],
    },
    minify: false,
    outDir: './../dist',
    emptyOutDir: true,
  }
})
