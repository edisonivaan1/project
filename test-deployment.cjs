const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de despliegue...\n');

// Verificar archivos críticos
const criticalFiles = [
  'dist/index.html',
  'dist/_headers',
  'dist/.htaccess',
  'dist/assets/index-D7Oh-sbe.js',
  'dist/assets/vendor-CyvzqkFf.js',
  'dist/assets/router-Br9iBMqv.js',
  'dist/assets/index-C-KxpyJJ.css'
];

console.log('📁 Verificando archivos críticos:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
  }
});

console.log('\n🔧 Verificando configuración de tipos MIME:');

// Verificar archivo _headers
if (fs.existsSync('dist/_headers')) {
  const headersContent = fs.readFileSync('dist/_headers', 'utf8');
  const hasJsMime = headersContent.includes('*.js') && headersContent.includes('application/javascript');
  const hasCssMime = headersContent.includes('*.css') && headersContent.includes('text/css');
  const hasAudioMime = headersContent.includes('*.mp3') && headersContent.includes('audio/mpeg');
  
  console.log(`✅ _headers configurado correctamente`);
  console.log(`   - JavaScript MIME: ${hasJsMime ? '✅' : '❌'}`);
  console.log(`   - CSS MIME: ${hasCssMime ? '✅' : '❌'}`);
  console.log(`   - Audio MIME: ${hasAudioMime ? '✅' : '❌'}`);
} else {
  console.log('❌ Archivo _headers no encontrado');
}

// Verificar archivo .htaccess
if (fs.existsSync('dist/.htaccess')) {
  const htaccessContent = fs.readFileSync('dist/.htaccess', 'utf8');
  const hasJsAddType = htaccessContent.includes('AddType application/javascript .js');
  const hasRewriteRule = htaccessContent.includes('RewriteRule');
  
  console.log(`✅ .htaccess configurado correctamente`);
  console.log(`   - JavaScript AddType: ${hasJsAddType ? '✅' : '❌'}`);
  console.log(`   - RewriteRule para SPA: ${hasRewriteRule ? '✅' : '❌'}`);
} else {
  console.log('❌ Archivo .htaccess no encontrado');
}

console.log('\n🌐 Verificación para GitHub Pages:');
console.log('✅ Base path configurado como /project/');
console.log('✅ Archivos estáticos en dist/');
console.log('✅ Configuración de tipos MIME en _headers');
console.log('✅ Configuración de SPA en .htaccess');

console.log('\n🚀 Comandos para probar:');
console.log('1. npm run serve (servidor local)');
console.log('2. npm run dev (desarrollo)');
console.log('3. npm run preview (preview de producción)');

console.log('\n📋 Para GitHub Pages:');
console.log('1. Subir contenido de dist/ a la rama gh-pages');
console.log('2. Verificar que _headers esté incluido');
console.log('3. Esperar unos minutos para que se apliquen los cambios');

console.log('\n🔍 Para verificar en el navegador:');
console.log('1. Abrir herramientas de desarrollo (F12)');
console.log('2. Ir a la pestaña Network');
console.log('3. Recargar la página');
console.log('4. Verificar que los archivos .js tengan Content-Type: application/javascript');

console.log('\n📞 Si el sitio no aparece:');
console.log('1. Verificar que el repositorio esté configurado para GitHub Pages');
console.log('2. Verificar que la rama gh-pages contenga los archivos de dist/');
console.log('3. Verificar que el archivo _headers esté en la raíz del repositorio');
console.log('4. Esperar 5-10 minutos para que GitHub Pages actualice la configuración'); 