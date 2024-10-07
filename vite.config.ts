import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.join(__dirname, 'public'),
  build: {
    outDir: path.join(__dirname, 'public'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.join(__dirname, 'src', 'main.ts'),
    },
  },
  plugins: [
    {
      name: 'watch-external',
      async buildStart() {
        this.addWatchFile(path.join(__dirname, 'layouts'))
        this.addWatchFile(path.join(__dirname, 'content'))
      },
    },
  ],
})