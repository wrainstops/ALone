import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  }
})
