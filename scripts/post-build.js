import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para configurar archivos después del build
function postBuildSetup() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  console.log('🔧 Configurando archivos para GitHub Pages...');
  
  // Actualizar index.html para agregar script SPA si no existe
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Verificar si ya tiene el script SPA
    if (!indexHtml.includes('Single Page Apps for GitHub Pages')) {
      const spaScript = `
    <script type="text/javascript">
        // Single Page Apps for GitHub Pages
        // https://github.com/rafgraph/spa-github-pages
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
      fs.writeFileSync(indexHtmlPath, indexHtml);
      console.log('✅ Script SPA agregado a index.html');
    } else {
      console.log('ℹ️ Script SPA ya existe en index.html');
    }
  }
  
  console.log('✅ Configuración de GitHub Pages completada');
}

// Ejecutar la función
postBuildSetup(); 