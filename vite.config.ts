import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '수업 진도 기록',
        short_name: '진도',
        description: '수업 진도를 빠르게 기록하세요',
        theme_color: '#007aff',
        background_color: '#f5f5f7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
})
