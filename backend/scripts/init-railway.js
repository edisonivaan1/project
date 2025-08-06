const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const SupportMessage = require('../models/SupportMessage');

// Configuración de Railway
const config = {
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
};

async function initializeRailway() {
  try {
    console.log('🚀 Inicializando Railway...');
    
    // Conectar a la base de datos
    await mongoose.connect(config.database.uri, config.database.options);
    console.log('✅ Conectado a MongoDB');
    
    // Verificar si ya existen datos
    const userCount = await User.countDocuments();
    const achievementCount = await Achievement.countDocuments();
    
    console.log(`📊 Usuarios existentes: ${userCount}`);
    console.log(`🏆 Logros existentes: ${achievementCount}`);
    
    // Si no hay logros, inicializarlos
    if (achievementCount === 0) {
      console.log('🏆 Inicializando logros...');
      await require('./init-achievements.js')();
      console.log('✅ Logros inicializados');
    }
    
    // Si no hay mensajes de soporte, inicializarlos
    const supportCount = await SupportMessage.countDocuments();
    if (supportCount === 0) {
      console.log('💬 Inicializando mensajes de soporte...');
      await require('./init-support.js')();
      console.log('✅ Mensajes de soporte inicializados');
    }
    
    console.log('✅ Railway inicializado correctamente');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error inicializando Railway:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeRailway();
}

module.exports = initializeRailway; 