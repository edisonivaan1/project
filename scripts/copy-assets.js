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

// Función para copiar todos los assets
function copyAllAssets() {
  const srcDir = path.join(__dirname, '..', 'src');
  const distDir = path.join(__dirname, '..', 'dist');
  const assetsDir = path.join(distDir, 'assets');

  console.log('📁 Copiando todos los assets...');

  // Asegurar que existe la carpeta assets
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
  } else {
    console.log('⚠️ No se encontró audio_questions en src/assets');
  }

  // Copiar audio principal
  const audioSrc = path.join(srcDir, 'assets', 'audio');
  const audioDest = path.join(assetsDir, 'audio');

  if (fs.existsSync(audioSrc)) {
    console.log('🎵 Copiando audio principal...');
    copyDirectory(audioSrc, audioDest);
    console.log('✅ audio principal copiado');
  } else {
    console.log('⚠️ No se encontró audio en src/assets');
  }

  // Copiar img
  const imgSrc = path.join(srcDir, 'assets', 'img');
  const imgDest = path.join(assetsDir, 'img');

  if (fs.existsSync(imgSrc)) {
    console.log('🖼️ Copiando imágenes...');
    copyDirectory(imgSrc, imgDest);
    console.log('✅ imágenes copiadas');
  } else {
    console.log('⚠️ No se encontró img en src/assets');
  }

  // Verificar estructura final
  console.log('📋 Estructura final de assets:');
  if (fs.existsSync(assetsDir)) {
    const assets = fs.readdirSync(assetsDir);
    assets.forEach(asset => {
      const assetPath = path.join(assetsDir, asset);
      if (fs.statSync(assetPath).isDirectory()) {
        const subAssets = fs.readdirSync(assetPath);
        console.log(`  📁 ${asset}/: ${subAssets.length} archivos`);
      } else {
        console.log(`  📄 ${asset}`);
      }
    });
  }

  console.log('✅ Copia de assets completada');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  copyAllAssets();
}

export default copyAllAssets; 