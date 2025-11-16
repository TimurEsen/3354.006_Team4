import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const SPRING_BOOT_PORT = 8080;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // Any request starting with '/api' from the frontend...
            '/api': {
                target: `http://localhost:${SPRING_BOOT_PORT}`,
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
