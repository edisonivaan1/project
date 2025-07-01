const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function setupTestUser() {
  console.log('🔧 Setting up test user...\n');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    securityQuestion: 'What is the name of your first pet?',
    securityAnswer: 'Fluffy'
  };
  
  try {
    // Intentar registrar el usuario
    console.log('1. Registering test user...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    
    if (registerResponse.data.success) {
      console.log('✅ Test user registered successfully');
      return testUser;
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  Test user already exists');
      return testUser;
    } else {
      console.log('❌ Registration error:', error.response?.data?.message || error.message);
      return null;
    }
  }
}

async function testServerConnection() {
  console.log('🏥 Testing server connection...\n');
  
  try {
    const response = await axios.get(`${API_BASE}/health`);
    if (response.data.success) {
      console.log('✅ Server is running and healthy');
      console.log('📍 Server response:', response.data.message);
      return true;
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 5000');
    return false;
  }
}

async function main() {
  console.log('🚀 Test Environment Setup\n');
  
  // Verificar conexión del servidor
  const serverOk = await testServerConnection();
  if (!serverOk) {
    console.log('\n❌ Cannot continue without server connection');
    return;
  }
  
  // Configurar usuario de prueba
  const testUser = await setupTestUser();
  if (!testUser) {
    console.log('\n❌ Cannot continue without test user');
    return;
  }
  
  console.log('\n✅ Setup completed successfully!');
  console.log('\n📋 Test user credentials:');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Password: ${testUser.password}`);
  console.log('\n🚀 You can now run: node test-progress.cjs');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupTestUser, testServerConnection }; 