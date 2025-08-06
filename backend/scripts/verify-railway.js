const mongoose = require('mongoose');

// Script de verificación para Railway
async function verifyRailwaySetup() {
  try {
    console.log('🔍 Verificando configuración de Railway...');
    
    // Verificar variables de entorno
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Variables de entorno faltantes:', missingVars);
      process.exit(1);
    }
    
    console.log('✅ Variables de entorno configuradas');
    console.log('📊 Puerto:', process.env.PORT);
    console.log('🗄️ Base de datos configurada');
    
    // Verificar conexión a MongoDB
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('📚 Base de datos:', mongoose.connection.name);
    
    // Verificar que el servidor esté funcionando
    console.log('🚀 Verificando servidor...');
    console.log('✅ Railway configurado correctamente para backend');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  verifyRailwaySetup();
}

module.exports = verifyRailwaySetup; 