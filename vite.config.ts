import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 文件路径，注意最后需要添加 ';'
        additionalData: '@import "@/styles/variable.scss";',
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  define: {
    'process.env': process.env
  },
})
