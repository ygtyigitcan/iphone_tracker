import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Dışarıdan erişime izin verir
    port: 5173, // Varsayılan port
    open: true, // Tarayıcıyı otomatik olarak açar
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Build çıktısının dizini
  },
});


