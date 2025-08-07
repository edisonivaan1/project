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

async function unlockAllLevelsForUser(email) {
  console.log('🔓 Unlocking all levels for test user...');
  
  try {
    // Primero hacer login para obtener el token
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: email,
      password: 'password123'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return false;
    }
    
    const token = loginResponse.data.token;
    
    // Hacer una petición para desbloquear todos los niveles
    // Esto actualizará todos los documentos de progreso del usuario
    const unlockResponse = await axios.post(`${API_BASE}/progress/unlock-all-levels`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (unlockResponse.data.success) {
      console.log('✅ All levels unlocked successfully');
      return true;
    } else {
      console.log('❌ Failed to unlock levels:', unlockResponse.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error unlocking levels:', error.response?.data?.message || error.message);
    return false;
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
  
  // Desbloquear todos los niveles para el usuario de prueba
  const unlockSuccess = await unlockAllLevelsForUser(testUser.email);
  if (!unlockSuccess) {
    console.log('\n⚠️  User created but failed to unlock all levels');
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

module.exports = { setupTestUser, testServerConnection, unlockAllLevelsForUser }; 