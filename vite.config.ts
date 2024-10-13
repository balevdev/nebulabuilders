import { defineConfig } from 'vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  root: path.join(__dirname, 'public'),
  build: {
    outDir: path.join(__dirname, 'public'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.join(__dirname, 'src', 'main.ts'),
      output: {
        manualChunks: {
          'fuse': ['fuse.js'],
          'htmx': ['htmx.org'],
        },
      },
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
    viteCompression(),
    visualizer({
      filename: './public/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  optimizeDeps: {
    include: ['fuse.js', 'htmx.org'],
  },
})