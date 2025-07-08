const mongoose = require('mongoose');
const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Progress = require('../models/Progress');
require('dotenv').config();

async function testDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://saidluna116:T3iwaYBCMe9Q2qZq@usabilidad.n1dphqq.mongodb.net/grammar_master_pro', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('🔌 Conectado a MongoDB');

    // 1. Crear usuario de prueba
    const testUser = new User({
      first_name: 'Test',
      last_name: 'User',
      email: `test${Date.now()}@example.com`,
      password_hash: 'password123',
      security_question: 'What is your favorite book?',
      security_answer_hash: 'test'
    });

    await testUser.save();
    console.log('👤 Usuario de prueba creado:', testUser._id);

    // 2. Crear intento de prueba
    const testAttempt = new Attempt({
      userId: testUser._id,
      topicId: 'present-tenses',
      difficulty: 'easy',
      score: {
        correct: 8,
        total: 10,
        percentage: 80
      },
      timeSpent: 120,
      hintsUsed: 2,
      questionsDetails: [
        {
          questionId: 'q1',
          userAnswer: 'test',
          correctAnswer: 'test',
          isCorrect: true,
          timeSpent: 30,
          hintsUsed: 1
        }
      ]
    });

    await testAttempt.save();
    console.log('🎯 Intento de prueba creado:', testAttempt._id);

    // 3. Crear progreso de prueba
    const testProgress = new Progress({
      userId: testUser._id,
      topicId: 'present-tenses',
      difficulty: 'easy',
      isCompleted: false,
      bestScore: {
        correct: 8,
        total: 10,
        percentage: 80
      },
      totalAttempts: 1,
      firstCompletedAt: null,
      lastAttemptAt: new Date(),
      averageScore: 80,
      totalTimeSpent: 120,
      totalHintsUsed: 2,
      isLocked: false
    });

    await testProgress.save();
    console.log('📈 Progreso de prueba creado:', testProgress._id);

    // 4. Verificar que se guardaron los datos
    const savedAttempt = await Attempt.findById(testAttempt._id).populate('userId');
    console.log('\n✅ Intento guardado correctamente:');
    console.log(JSON.stringify(savedAttempt, null, 2));

    const savedProgress = await Progress.findById(testProgress._id);
    console.log('\n✅ Progreso guardado correctamente:');
    console.log(JSON.stringify(savedProgress, null, 2));

    // 5. Limpiar datos de prueba
    await User.deleteOne({ _id: testUser._id });
    await Attempt.deleteOne({ _id: testAttempt._id });
    await Progress.deleteOne({ _id: testProgress._id });
    console.log('\n🧹 Datos de prueba eliminados');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
}

// Ejecutar prueba
console.log('🧪 Iniciando prueba de base de datos...\n');
testDatabase(); 