import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

import * as path from 'path';

// const path = require('path')

export default defineConfig({
  base: '/app1/', //追加
  // base: './', //追加
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  define: { 'process.env': {} },
  build: {
    outDir: 'docs',
    assetsDir: './assets',
    publicPath: './',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
  },
})
