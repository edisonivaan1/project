const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function createProductionUser() {
  console.log('🚀 Creating production user with all levels unlocked...\n');
  
  // Usuario de producción con email fijo
  const productionUser = {
    firstName: 'Production',
    lastName: 'User',
    email: 'production@grammar-master.com',
    password: 'production123',
    confirmPassword: 'production123',
    securityQuestion: 'What is the name of your first pet?',
    securityAnswer: 'Production'
  };
  
  try {
    // 1. Registrar el usuario
    console.log('1. Registering production user...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, productionUser);
    
    if (registerResponse.data.success) {
      console.log('✅ Production user registered successfully');
    } else {
      console.log('ℹ️  Production user already exists');
    }
    
    // 2. Hacer login para obtener token
    console.log('2. Logging in to get access token...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: productionUser.email,
      password: productionUser.password
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return false;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // 3. Desbloquear todos los niveles
    console.log('3. Unlocking all levels...');
    const unlockResponse = await axios.post(`${API_BASE}/auth/unlock-all-levels`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (unlockResponse.data.success) {
      console.log('✅ All levels unlocked successfully');
    } else {
      console.log('❌ Failed to unlock levels:', unlockResponse.data.message);
      return false;
    }
    
    console.log('\n🎉 Production user created successfully!');
    console.log('\n📋 Production user credentials:');
    console.log(`   Email: ${productionUser.email}`);
    console.log(`   Password: ${productionUser.password}`);
    console.log('\n✅ All levels are unlocked and ready for production use');
    
    return true;
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  Production user already exists, proceeding with login...');
      
      // Si el usuario ya existe, solo hacer login y desbloquear
      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: productionUser.email,
          password: productionUser.password
        });
        
        if (!loginResponse.data.success) {
          console.log('❌ Login failed:', loginResponse.data.message);
          return false;
        }
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        
        // Desbloquear todos los niveles
        console.log('3. Unlocking all levels...');
        const unlockResponse = await axios.post(`${API_BASE}/auth/unlock-all-levels`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (unlockResponse.data.success) {
          console.log('✅ All levels unlocked successfully');
        } else {
          console.log('❌ Failed to unlock levels:', unlockResponse.data.message);
          return false;
        }
        
        console.log('\n🎉 Production user ready!');
        console.log('\n📋 Production user credentials:');
        console.log(`   Email: ${productionUser.email}`);
        console.log(`   Password: ${productionUser.password}`);
        console.log('\n✅ All levels are unlocked and ready for production use');
        
        return true;
      } catch (loginError) {
        console.log('❌ Error during login/unlock process:', loginError.response?.data?.message || loginError.message);
        return false;
      }
    } else {
      console.log('❌ Error creating production user:', error.response?.data?.message || error.message);
      return false;
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
  console.log('🚀 Production User Setup\n');
  
  // Verificar conexión del servidor
  const serverOk = await testServerConnection();
  if (!serverOk) {
    console.log('\n❌ Cannot continue without server connection');
    return;
  }
  
  // Crear usuario de producción
  const success = await createProductionUser();
  
  if (success) {
    console.log('\n✅ Production setup completed successfully!');
    console.log('\n🚀 Ready for production deployment');
  } else {
    console.log('\n❌ Production setup failed');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createProductionUser, testServerConnection }; 