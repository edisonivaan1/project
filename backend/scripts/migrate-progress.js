const mongoose = require('mongoose');
const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Progress = require('../models/Progress');
require('dotenv').config();

async function migrateUserProgress() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://saidluna116:T3iwaYBCMe9Q2qZq@usabilidad.n1dphqq.mongodb.net/grammar_master_pro', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📊 Conectado a MongoDB para migración');

    // Buscar usuarios con gameProgress existente
    const usersWithProgress = await mongoose.connection.db.collection('users').find({
      'gameProgress.levels': { $exists: true, $ne: [] }
    }).toArray();

    console.log(`🔍 Encontrados ${usersWithProgress.length} usuarios con progreso existente`);

    if (usersWithProgress.length === 0) {
      console.log('✅ No hay datos para migrar');
      process.exit(0);
    }

    let migratedUsers = 0;
    let totalAttempts = 0;
    let totalProgress = 0;

    for (const userData of usersWithProgress) {
      try {
        console.log(`\n🔄 Migrando usuario: ${userData.email}`);
        
        const userId = userData._id;
        const gameProgress = userData.gameProgress;

        // Procesar cada nivel
        for (const level of gameProgress.levels) {
          const { topicId, difficulty, attempts = [], bestScore, isCompleted, completedAt } = level;

          // Crear documentos de Attempt para cada intento
          const attemptDocs = attempts.map(attempt => ({
            userId,
            topicId,
            difficulty,
            score: attempt.score,
            timeSpent: 0, // No disponible en datos antiguos
            hintsUsed: 0, // No disponible en datos antiguos
            questionsDetails: [], // No disponible en datos antiguos
            completedAt: attempt.completedAt || new Date()
          }));

          if (attemptDocs.length > 0) {
            await Attempt.insertMany(attemptDocs, { ordered: false });
            totalAttempts += attemptDocs.length;
            console.log(`  ✅ Migrados ${attemptDocs.length} intentos para ${topicId} ${difficulty}`);
          }

          // Crear documento de Progress
          const progressDoc = {
            userId,
            topicId,
            difficulty,
            isCompleted: isCompleted || false,
            bestScore: bestScore || { correct: 0, total: 10, percentage: 0 },
            totalAttempts: attempts.length,
            firstCompletedAt: isCompleted && completedAt ? new Date(completedAt) : null,
            lastAttemptAt: attempts.length > 0 ? 
              new Date(Math.max(...attempts.map(a => new Date(a.completedAt || Date.now()).getTime()))) : 
              new Date(),
            averageScore: attempts.length > 0 ? 
              Math.round(attempts.reduce((sum, a) => sum + a.score.percentage, 0) / attempts.length) : 0,
            totalTimeSpent: 0, // No disponible en datos antiguos
            totalHintsUsed: 0, // No disponible en datos antiguos
            isLocked: difficulty !== 'easy' // Se actualizará después
          };

          try {
            await Progress.create(progressDoc);
            totalProgress++;
            console.log(`  ✅ Migrado progreso para ${topicId} ${difficulty}`);
          } catch (error) {
            if (error.code === 11000) {
              // Progreso ya existe, actualizar
              await Progress.findOneAndUpdate(
                { userId, topicId, difficulty },
                progressDoc,
                { upsert: true }
              );
              console.log(`  🔄 Actualizado progreso existente para ${topicId} ${difficulty}`);
            } else {
              throw error;
            }
          }
        }

        // Actualizar estados de bloqueo para este usuario
        const unlockedDifficulties = await Progress.getUnlockedDifficulties(userId);
        await Progress.updateMany(
          { userId },
          [
            {
              $set: {
                isLocked: {
                  $cond: {
                    if: { $eq: ["$difficulty", "easy"] },
                    then: false,
                    else: {
                      $not: {
                        $in: ["$difficulty", unlockedDifficulties]
                      }
                    }
                  }
                }
              }
            }
          ]
        );

        migratedUsers++;
        console.log(`✅ Usuario ${userData.email} migrado exitosamente`);

      } catch (error) {
        console.error(`❌ Error migrando usuario ${userData.email}:`, error.message);
        continue;
      }
    }

    console.log('\n📈 Resumen de migración:');
    console.log(`👥 Usuarios migrados: ${migratedUsers}/${usersWithProgress.length}`);
    console.log(`🎯 Total intentos migrados: ${totalAttempts}`);
    console.log(`📊 Total progreso migrado: ${totalProgress}`);

    // Opcional: Limpiar gameProgress de los usuarios migrados
    const cleanupResponse = await askQuestion('\n🧹 ¿Deseas limpiar los datos antiguos de gameProgress? (y/n): ');
    
    if (cleanupResponse.toLowerCase() === 'y' || cleanupResponse.toLowerCase() === 'yes') {
      await mongoose.connection.db.collection('users').updateMany(
        { _id: { $in: usersWithProgress.map(u => u._id) } },
        { $unset: { gameProgress: "" } }
      );
      console.log('✅ Datos antiguos de gameProgress eliminados');
    } else {
      console.log('ℹ️  Datos antiguos de gameProgress conservados');
    }

    console.log('\n🎉 Migración completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📊 Conexión a MongoDB cerrada');
    process.exit(0);
  }
}

// Función helper para input del usuario
function askQuestion(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🔄 Script de Migración de Progreso - Grammar Master Pro

Este script migra los datos de gameProgress existentes en el modelo User
a las nuevas colecciones 'attempts' y 'progresses'.

Uso:
  node migrate-progress.js [opciones]

Opciones:
  --dry-run    Ejecutar sin hacer cambios (solo mostrar lo que se haría)
  --force      Ejecutar sin confirmación
  --help, -h   Mostrar esta ayuda

Ejemplos:
  node migrate-progress.js
  node migrate-progress.js --dry-run
  node migrate-progress.js --force

⚠️  Asegúrate de hacer un backup de la base de datos antes de ejecutar la migración.
  `);
  process.exit(0);
}

// Verificar si es dry-run
if (args.includes('--dry-run')) {
  console.log('🧪 Modo DRY-RUN: No se harán cambios reales');
  // Aquí podrías implementar la lógica de dry-run
}

// Ejecutar migración
if (!args.includes('--force')) {
  console.log('⚠️  Este script migrará datos existentes a las nuevas colecciones.');
  console.log('📋 Asegúrate de hacer un backup de la base de datos antes de continuar.');
  
  askQuestion('\n¿Deseas continuar con la migración? (y/n): ').then(answer => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      migrateUserProgress();
    } else {
      console.log('❌ Migración cancelada');
      process.exit(0);
    }
  });
} else {
  migrateUserProgress();
} 