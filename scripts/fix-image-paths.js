import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para verificar y corregir rutas de imágenes
function fixImagePaths() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  console.log('🔍 Verificando rutas de imágenes...');
  
  // Verificar archivos CSS
  const cssFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.css'));
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(distDir, cssFile);
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Buscar rutas de imágenes con /project/
    const imagePathRegex = /\/project\/assets\/([^"']*\.(png|jpg|jpeg|svg|gif))/g;
    const matches = cssContent.match(imagePathRegex);
    
    if (matches) {
      console.log(`📸 Encontradas rutas de imágenes en ${cssFile}:`, matches);
      
      // Corregir rutas
      cssContent = cssContent.replace(/\/project\/assets\//g, '/assets/');
      
      fs.writeFileSync(cssPath, cssContent);
      console.log(`✅ Rutas de imágenes corregidas en ${cssFile}`);
    }
  });
  
  // Verificar archivo index.html
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Buscar rutas de imágenes
    const imagePathRegex = /\/project\/assets\/([^"']*\.(png|jpg|jpeg|svg|gif))/g;
    const matches = indexHtml.match(imagePathRegex);
    
    if (matches) {
      console.log('📸 Encontradas rutas de imágenes en index.html:', matches);
      
      // Corregir rutas
      indexHtml = indexHtml.replace(/\/project\/assets\//g, '/assets/');
      
      fs.writeFileSync(indexHtmlPath, indexHtml);
      console.log('✅ Rutas de imágenes corregidas en index.html');
    }
  }
  
  console.log('✅ Verificación de rutas de imágenes completada');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixImagePaths();
}

export default fixImagePaths; 