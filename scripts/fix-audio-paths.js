import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para verificar y corregir rutas de audio
function fixAudioPaths() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  console.log('🔍 Verificando rutas de audio...');
  
  // Verificar archivos JavaScript
  const jsFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.js'));
  jsFiles.forEach(jsFile => {
    const jsPath = path.join(distDir, jsFile);
    let jsContent = fs.readFileSync(jsPath, 'utf8');
    
    // Buscar rutas de audio con /project/
    const audioPathRegex = /\/project\/assets\/([^"']*\.(mp3|wav|ogg))/g;
    const matches = jsContent.match(audioPathRegex);
    
    if (matches) {
      console.log(`🎵 Encontradas rutas de audio en ${jsFile}:`, matches);
      
      // Corregir rutas
      jsContent = jsContent.replace(/\/project\/assets\//g, '/assets/');
      
      fs.writeFileSync(jsPath, jsContent);
      console.log(`✅ Rutas de audio corregidas en ${jsFile}`);
    }
  });
  
  // Verificar archivo index.html
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Buscar rutas de audio
    const audioPathRegex = /\/project\/assets\/([^"']*\.(mp3|wav|ogg))/g;
    const matches = indexHtml.match(audioPathRegex);
    
    if (matches) {
      console.log('🎵 Encontradas rutas de audio en index.html:', matches);
      
      // Corregir rutas
      indexHtml = indexHtml.replace(/\/project\/assets\//g, '/assets/');
      
      fs.writeFileSync(indexHtmlPath, indexHtml);
      console.log('✅ Rutas de audio corregidas en index.html');
    }
  }
  
  // Verificar carpeta de assets
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    console.log('📁 Verificando estructura de assets...');
    
    // Verificar carpeta de audio
    const audioDir = path.join(assetsDir, 'audio');
    if (fs.existsSync(audioDir)) {
      const audioFiles = fs.readdirSync(audioDir);
      console.log('🎵 Archivos de audio encontrados:', audioFiles);
    }
    
    // Verificar carpeta de audio_questions
    const audioQuestionsDir = path.join(assetsDir, 'audio_questions');
    if (fs.existsSync(audioQuestionsDir)) {
      const audioQuestionDirs = fs.readdirSync(audioQuestionsDir);
      console.log('🎵 Carpetas de audio_questions:', audioQuestionDirs);
      
      audioQuestionDirs.forEach(dir => {
        const fullDirPath = path.join(audioQuestionsDir, dir);
        if (fs.statSync(fullDirPath).isDirectory()) {
          const files = fs.readdirSync(fullDirPath);
          console.log(`🎵 Archivos en ${dir}:`, files);
        }
      });
    }
  }
  
  console.log('✅ Verificación de rutas de audio completada');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixAudioPaths();
}

export default fixAudioPaths; 