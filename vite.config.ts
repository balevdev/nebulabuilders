import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'static',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'src/ts/main.ts',
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: 'assets/[ext]/[name].[ext]'
      }
    }
  }
})