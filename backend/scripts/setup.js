const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Grammar Master Pro Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Puerto del servidor
PORT=5000

# URI de conexión a MongoDB Atlas
MONGODB_URI=mongodb+srv://saidluna116:T3iwaYBCMe9Q2qZq@usabilidad.n1dphqq.mongodb.net/grammar_master_pro

# Clave secreta para JWT (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=grammar_master_pro_secret_key_${Date.now()}

# Entorno de la aplicación
NODE_ENV=development
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('\n📋 Please create the .env file manually with this content:');
    console.log(envContent);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🔧 Setup complete!');
console.log('\n📚 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev');
console.log('3. Check: http://localhost:5000/api/health');
console.log('\n📖 For more information, see README.md'); 