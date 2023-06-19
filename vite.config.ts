import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
    VitePWA({
      includeAssets: ['someone-pwa.png'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Someone',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'someone-pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'someone-pwa.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({}), // add options if needed
      ],
    },
  },
});
