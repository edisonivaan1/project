import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para corregir rutas de audio en las preguntas
function fixQuestionAudioPaths() {
  const srcDir = path.join(__dirname, '..', 'src');
  const sampleQuestionsPath = path.join(srcDir, 'data', 'sampleQuestions.ts');
  
  console.log('🔍 Corrigiendo rutas de audio en las preguntas...');
  
  if (fs.existsSync(sampleQuestionsPath)) {
    let content = fs.readFileSync(sampleQuestionsPath, 'utf8');
    
    // Buscar rutas de audio con /src/assets/
    const audioPathRegex = /\/src\/assets\/audio_questions\/([^"']*\.mp3)/g;
    const matches = content.match(audioPathRegex);
    
    if (matches) {
      console.log('🎵 Encontradas rutas de audio en sampleQuestions.ts:', matches);
      
      // Corregir rutas de /src/assets/audio_questions/ a /assets/audio_questions/
      content = content.replace(/\/src\/assets\/audio_questions\//g, '/assets/audio_questions/');
      
      fs.writeFileSync(sampleQuestionsPath, content);
      console.log('✅ Rutas de audio corregidas en sampleQuestions.ts');
    } else {
      console.log('ℹ️ No se encontraron rutas de audio para corregir');
    }
  } else {
    console.log('⚠️ No se encontró sampleQuestions.ts');
  }
  
  // Verificar que los archivos de audio existan
  const audioQuestionsDir = path.join(srcDir, 'assets', 'audio_questions');
  if (fs.existsSync(audioQuestionsDir)) {
    console.log('📁 Verificando archivos de audio_questions...');
    
    const categories = fs.readdirSync(audioQuestionsDir);
    categories.forEach(category => {
      const categoryPath = path.join(audioQuestionsDir, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const audioFiles = fs.readdirSync(categoryPath);
        console.log(`  📁 ${category}/: ${audioFiles.length} archivos de audio`);
      }
    });
  } else {
    console.log('⚠️ No se encontró audio_questions en src/assets');
  }
  
  console.log('✅ Verificación de rutas de audio completada');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixQuestionAudioPaths();
}

export default fixQuestionAudioPaths; 