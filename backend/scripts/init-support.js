const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelo
const SupportMessage = require('../models/SupportMessage');

// Conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grammarmaster');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Función para inicializar el sistema de soporte
const initializeSupport = async () => {
  try {
    console.log('🚀 Inicializando sistema de soporte...');

    // Verificar que el modelo funcione correctamente
    const testMessage = {
      message: 'Mensaje de prueba del sistema',
      category: 'technical',
      userEmail: 'test@example.com',
      status: 'open',
      priority: 'medium'
    };

    // Crear un mensaje de prueba (opcional)
    // const supportMessage = new SupportMessage(testMessage);
    // await supportMessage.save();
    // console.log('✅ Mensaje de prueba creado:', supportMessage._id);

    // Verificar índices
    await SupportMessage.ensureIndexes();
    console.log('✅ Índices de SupportMessage verificados');

    // Obtener estadísticas actuales
    const stats = await SupportMessage.getStats();
    console.log('📊 Estadísticas actuales:', stats);

    const totalMessages = await SupportMessage.countDocuments();
    console.log(`📈 Total de mensajes: ${totalMessages}`);

    console.log('✅ Sistema de soporte inicializado correctamente');

  } catch (error) {
    console.error('❌ Error inicializando sistema de soporte:', error);
  }
};

// Función principal
const main = async () => {
  await connectDB();
  await initializeSupport();
  
  console.log('\n📝 Instrucciones de uso:');
  console.log('1. Los usuarios pueden enviar mensajes desde /help');
  console.log('2. Los mensajes se guardan automáticamente en la BD');
  console.log('3. Los administradores pueden ver mensajes en /api/support/messages');
  console.log('4. Se pueden actualizar estados con /api/support/messages/:id/status');
  console.log('5. Estadísticas disponibles en /api/support/stats');
  
  console.log('\n🔧 Categorías disponibles:');
  console.log('- technical: Problemas técnicos');
  console.log('- content: Contenido del juego'); 
  console.log('- account: Cuenta de usuario');
  console.log('- feedback: Sugerencias/Feedback');
  console.log('- other: Otro');
  
  console.log('\n📋 Estados de mensajes:');
  console.log('- open: Nuevo mensaje');
  console.log('- in_progress: En proceso');
  console.log('- resolved: Resuelto');
  console.log('- closed: Cerrado');

  await mongoose.connection.close();
  console.log('\n👋 Proceso completado');
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { initializeSupport };