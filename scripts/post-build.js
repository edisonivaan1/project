import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para configurar archivos después del build
function postBuildSetup() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  console.log('🔧 Configurando archivos para Vercel...');
  
  // 1. Crear archivo .nojekyll (para compatibilidad)
  const nojekyllPath = path.join(distDir, '.nojekyll');
  fs.writeFileSync(nojekyllPath, '# Este archivo deshabilita el procesamiento de Jekyll\n');
  console.log('✅ Archivo .nojekyll creado');
  
  // 2. Crear archivo 404.html con configuración correcta para Vercel
  const html404 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Grammar Master Pro</title>
    <script type="text/javascript">
        // Single Page Apps para Vercel
        // Redirigir a la página principal
        window.location.href = '/';
    </script>
</head>
<body>
    <p>Redirigiendo...</p>
</body>
</html>`;
  
  const html404Path = path.join(distDir, '404.html');
  fs.writeFileSync(html404Path, html404);
  console.log('✅ Archivo 404.html creado para Vercel');
  
  // 3. Actualizar index.html para corregir rutas y agregar script SPA
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Corregir rutas de /project/ a /
    indexHtml = indexHtml.replace(/\/project\//g, '/');
    
    // Verificar si ya tiene el script SPA
    if (!indexHtml.includes('Single Page Apps')) {
      const spaScript = `
<script type="text/javascript">
    // Single Page Apps para Vercel
    // This script checks to see if a redirect is present in the query string,
    // converts it back into the correct url and adds it to the
    // browser's history using window.history.replaceState(...),
    // which won't cause the browser to attempt to load the new url.
    // When the single page app is loaded further down in this file,
    // it takes the correct url from the browser's current location.
    (function(l) {
        if (l.search[1] === '/' ) {
            var decoded = l.search.slice(1).split('&').map(function(s) { 
                return s.replace(/~and~/g, '&')
            }).join('?');
            window.history.replaceState(null, null,
                l.pathname.slice(0, -1) + decoded + l.hash
            );
        }
    }(window.location))
</script>`;
      
      // Insertar el script antes del cierre de </head>
      indexHtml = indexHtml.replace('</head>', `${spaScript}\n  </head>`);
    }
    
    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('✅ Rutas corregidas en index.html para Vercel');
  }
  
  // 4. Corregir rutas en archivos CSS y verificar imágenes y audios
  const cssFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.css'));
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(distDir, cssFile);
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Corregir rutas de imágenes y audios en CSS
    cssContent = cssContent.replace(/\/project\//g, '/');
    
    fs.writeFileSync(cssPath, cssContent);
    console.log(`✅ Rutas corregidas en ${cssFile}`);
  });
  
  // 5. Verificar que las imágenes y audios estén en la carpeta assets
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const assets = fs.readdirSync(assetsDir);
    console.log('📸 Assets encontrados:', assets);
    
    // Verificar subcarpetas de audio
    const audioDirs = ['audio', 'audio_questions'];
    audioDirs.forEach(audioDir => {
      const fullAudioPath = path.join(assetsDir, audioDir);
      if (fs.existsSync(fullAudioPath)) {
        const audioFiles = fs.readdirSync(fullAudioPath);
        console.log(`🎵 Archivos de audio en ${audioDir}:`, audioFiles);
      }
    });
  }
  
  // 6. Corregir rutas en archivos JavaScript si existen
  const jsFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.js'));
  jsFiles.forEach(jsFile => {
    const jsPath = path.join(distDir, jsFile);
    let jsContent = fs.readFileSync(jsPath, 'utf8');
    
    // Corregir rutas de /project/ a /
    jsContent = jsContent.replace(/\/project\//g, '/');
    
    fs.writeFileSync(jsPath, jsContent);
    console.log(`✅ Rutas corregidas en ${jsFile}`);
  });
  
  console.log('✅ Configuración de Vercel completada');
}

// Ejecutar la función
postBuildSetup(); 