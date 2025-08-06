import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/project/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Copiar archivos adicionales al directorio dist
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
        // Asegurar que los archivos JS tengan la extensión correcta
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash].[ext]`;
          }
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
    // Configuración específica para GitHub Pages
    target: 'es2015',
    minify: 'terser',
  },
  // Configuración del servidor de desarrollo
  server: {
    headers: {
      'Content-Type': 'application/javascript',
    },
    // Configuración adicional para tipos MIME
    fs: {
      strict: false,
    },
  },
  // Configuración para preview
  preview: {
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
});
