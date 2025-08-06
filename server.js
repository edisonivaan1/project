import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// Middleware para servir archivos estáticos con tipos MIME correctos
app.use(express.static('dist', {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (mimeTypes[ext]) {
      res.set('Content-Type', mimeTypes[ext]);
    }
    
    // Configuración específica para archivos JavaScript
    if (ext === '.js' || ext === '.mjs') {
      res.set('Content-Type', 'application/javascript');
    }
    
    // Configuración para archivos de audio
    if (ext === '.mp3' || ext === '.wav') {
      res.set('Content-Type', mimeTypes[ext]);
    }
    
    // Configuración para archivos de imagen
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
      res.set('Content-Type', mimeTypes[ext]);
    }
    
    // Configuración para archivos CSS
    if (ext === '.css') {
      res.set('Content-Type', 'text/css');
    }
    
    // Configuración para archivos HTML
    if (ext === '.html') {
      res.set('Content-Type', 'text/html');
    }
  }
}));

// Middleware para manejar rutas de SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Archivos estáticos servidos desde: dist/');
  console.log('Tipos MIME configurados correctamente para archivos JavaScript');
}); 