#!/usr/bin/env node

/**
 * Script para inicializar achievements en la base de datos
 * Uso: node scripts/init-achievements.js
 */

const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');

// Load environment variables
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grammar-master-pro');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const initializeAchievements = async () => {
  try {
    console.log('🚀 Inicializando achievements...');
    
    // Initialize default achievements
    await Achievement.initializeDefaultAchievements();
    
    // Get count of achievements
    const count = await Achievement.countDocuments();
    console.log(`📊 Total de achievements en la base de datos: ${count}`);
    
    // Display all achievements
    const achievements = await Achievement.find().sort({ category: 1, displayOrder: 1 });
    
    console.log('\n🏆 ACHIEVEMENTS DISPONIBLES:');
    console.log('='.repeat(60));
    
    let currentCategory = '';
    achievements.forEach(achievement => {
      if (achievement.category !== currentCategory) {
        currentCategory = achievement.category;
        console.log(`\n📂 ${currentCategory.toUpperCase()}:`);
      }
      
      console.log(`  ${achievement.icon} ${achievement.name}`);
      console.log(`     ${achievement.description}`);
      console.log(`     Tipo: ${achievement.requirements.type} ${achievement.requirements.operator} ${achievement.requirements.value}`);
      console.log(`     Puntos: ${achievement.points}`);
      console.log();
    });
    
    console.log('✅ Achievements inicializados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error inicializando achievements:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await initializeAchievements();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }
};

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { initializeAchievements };