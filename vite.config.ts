import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Asegurar que se generen archivos JavaScript modernos
    target: 'esnext',
    minify: 'esbuild',
  },
  // Copiar todos los assets estáticos
  publicDir: 'public',
  // Asegurar que se copien todos los assets
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
});
