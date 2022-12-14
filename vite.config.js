import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "node:path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      web3: 'web3/dist/web3.min.js',
    },
  },
  plugins: [vue(), VueI18nPlugin({
    include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
  })]
})
