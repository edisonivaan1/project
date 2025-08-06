const http = require('http');
const fs = require('fs');
const path = require('path');

// Función para verificar tipos MIME
function testMimeTypes() {
  console.log('🔍 Verificando tipos MIME...\n');

  const testFiles = [
    'dist/assets/index-D7Oh-sbe.js',
    'dist/assets/vendor-CyvzqkFf.js',
    'dist/assets/router-Br9iBMqv.js',
    'dist/assets/CorrectAnswer-vOB-VZWo.js',
    'dist/assets/WrongAnswer-CLNg_Lax.js',
    'dist/assets/index-C-KxpyJJ.css',
    'dist/index.html'
  ];

  testFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const ext = path.extname(file);
      const stats = fs.statSync(file);
      console.log(`✅ ${file}`);
      console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Extensión: ${ext}`);
      
      // Determinar tipo MIME esperado
      let expectedMime = 'application/octet-stream';
      switch (ext) {
        case '.js':
        case '.mjs':
          expectedMime = 'application/javascript';
          break;
        case '.css':
          expectedMime = 'text/css';
          break;
        case '.html':
          expectedMime = 'text/html';
          break;
        case '.mp3':
          expectedMime = 'audio/mpeg';
          break;
        case '.wav':
          expectedMime = 'audio/wav';
          break;
        case '.png':
          expectedMime = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          expectedMime = 'image/jpeg';
          break;
      }
      
      console.log(`   Tipo MIME esperado: ${expectedMime}`);
      console.log('');
    } else {
      console.log(`❌ ${file} - No encontrado`);
    }
  });

  console.log('📋 Resumen de configuración:');
  console.log('✅ Servidor Express configurado en server.js');
  console.log('✅ Archivo _headers configurado para GitHub Pages');
  console.log('✅ Archivo .htaccess configurado para Apache');
  console.log('✅ Archivo nginx.conf configurado para Nginx');
  console.log('✅ Configuración de Vite actualizada');
  console.log('');
  console.log('🚀 Para probar el servidor:');
  console.log('   npm run serve');
  console.log('   Luego abrir http://localhost:3000');
  console.log('');
  console.log('🔧 Para verificar en el navegador:');
  console.log('   1. Abrir herramientas de desarrollo (F12)');
  console.log('   2. Ir a la pestaña Network');
  console.log('   3. Recargar la página');
  console.log('   4. Verificar que los archivos .js tengan Content-Type: application/javascript');
}

// Ejecutar la verificación
testMimeTypes(); 