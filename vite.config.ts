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
      devOptions: {
        enabled: false,
        /* other options */
      },
      includeAssets: ['someone-192.png', 'someone-512.png'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Someone',
        short_name: "Someone",
        theme_color: '#151617',
        icons: [
          {
            src: 'someone-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'someone-512.png',
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
