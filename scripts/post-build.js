import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para copiar directorios recursivamente
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Función para configurar archivos después del build
function postBuildSetup() {
  const distDir = path.join(__dirname, '..', 'dist');
  const srcDir = path.join(__dirname, '..', 'src');
  
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
  
  // 3. Copiar todos los assets que faltan
  const assetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  // Copiar audio_questions completo
  const audioQuestionsSrc = path.join(srcDir, 'assets', 'audio_questions');
  const audioQuestionsDest = path.join(assetsDir, 'audio_questions');
  
  if (fs.existsSync(audioQuestionsSrc)) {
    console.log('🎵 Copiando audio_questions...');
    copyDirectory(audioQuestionsSrc, audioQuestionsDest);
    console.log('✅ audio_questions copiado');
  }
  
  // Copiar audio principal si no existe
  const audioSrc = path.join(srcDir, 'assets', 'audio');
  const audioDest = path.join(assetsDir, 'audio');
  
  if (fs.existsSync(audioSrc) && !fs.existsSync(audioDest)) {
    console.log('🎵 Copiando audio principal...');
    copyDirectory(audioSrc, audioDest);
    console.log('✅ audio principal copiado');
  }
  
  // Copiar img si no existe
  const imgSrc = path.join(srcDir, 'assets', 'img');
  const imgDest = path.join(assetsDir, 'img');
  
  if (fs.existsSync(imgSrc) && !fs.existsSync(imgDest)) {
    console.log('🖼️ Copiando imágenes...');
    copyDirectory(imgSrc, imgDest);
    console.log('✅ imágenes copiadas');
  }
  
  // 4. Actualizar index.html para corregir rutas y agregar script SPA
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
  
  // 5. Corregir rutas en archivos CSS y verificar imágenes y audios
  const cssFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.css'));
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(distDir, cssFile);
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Corregir rutas de imágenes y audios en CSS
    cssContent = cssContent.replace(/\/project\//g, '/');
    
    fs.writeFileSync(cssPath, cssContent);
    console.log(`✅ Rutas corregidas en ${cssFile}`);
  });
  
  // 6. Corregir rutas en archivos JavaScript
  const jsFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.js'));
  jsFiles.forEach(jsFile => {
    const jsPath = path.join(distDir, jsFile);
    let jsContent = fs.readFileSync(jsPath, 'utf8');
    
    // Corregir rutas de /project/ a /
    jsContent = jsContent.replace(/\/project\//g, '/');
    
    // Corregir rutas de /src/assets/ a /assets/
    jsContent = jsContent.replace(/\/src\/assets\//g, '/assets/');
    
    // Corregir rutas de ../assets/ a /assets/
    jsContent = jsContent.replace(/\.\.\/assets\//g, '/assets/');
    
    fs.writeFileSync(jsPath, jsContent);
    console.log(`✅ Rutas corregidas en ${jsFile}`);
  });
  
  // 7. Verificar estructura final de assets
  console.log('📋 Estructura final de assets:');
  if (fs.existsSync(assetsDir)) {
    const assets = fs.readdirSync(assetsDir);
    assets.forEach(asset => {
      const assetPath = path.join(assetsDir, asset);
      if (fs.statSync(assetPath).isDirectory()) {
        const subAssets = fs.readdirSync(assetPath);
        console.log(`  📁 ${asset}/: ${subAssets.length} archivos`);
        
        // Mostrar subdirectorios si existen
        subAssets.forEach(subAsset => {
          const subAssetPath = path.join(assetPath, subAsset);
          if (fs.statSync(subAssetPath).isDirectory()) {
            const subSubAssets = fs.readdirSync(subAssetPath);
            console.log(`    📁 ${asset}/${subAsset}/: ${subSubAssets.length} archivos`);
          }
        });
      } else {
        console.log(`  📄 ${asset}`);
      }
    });
  }
  
  console.log('✅ Configuración de Vercel completada');
}

// Ejecutar la función
postBuildSetup(); 