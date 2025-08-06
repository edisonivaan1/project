import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para corregir rutas de assets en archivos
function fixAssetPathsInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Corregir rutas de /src/assets/ a /assets/
  const srcAssetsRegex = /\/src\/assets\//g;
  if (content.match(srcAssetsRegex)) {
    content = content.replace(srcAssetsRegex, '/assets/');
    hasChanges = true;
    console.log(`✅ Corregidas rutas en ${filePath}`);
  }
  
  // Corregir rutas de ../assets/ a /assets/
  const relativeAssetsRegex = /\.\.\/assets\//g;
  if (content.match(relativeAssetsRegex)) {
    content = content.replace(relativeAssetsRegex, '/assets/');
    hasChanges = true;
    console.log(`✅ Corregidas rutas relativas en ${filePath}`);
  }
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
  }
}

// Función para corregir todas las rutas de assets
function fixAllAssetPaths() {
  const srcDir = path.join(__dirname, '..', 'src');
  
  console.log('🔍 Corrigiendo rutas de assets en todo el código...');
  
  // Función recursiva para procesar archivos
  function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Ignorar node_modules y otros directorios
        if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
          processDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Procesar solo archivos TypeScript/JavaScript
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
          fixAssetPathsInFile(fullPath);
        }
      }
    }
  }
  
  processDirectory(srcDir);
  
  console.log('✅ Corrección de rutas de assets completada');
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  fixAllAssetPaths();
}

export default fixAllAssetPaths; 