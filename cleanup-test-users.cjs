const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function cleanupTestUsers() {
  console.log('🧹 Cleaning up test users...\n');
  
  try {
    // Buscar usuarios de prueba existentes (que empiecen con 'test-')
    const response = await axios.get(`${API_BASE}/auth/test-users`);
    
    if (response.data.success && response.data.users.length > 0) {
      console.log(`Found ${response.data.users.length} test users to clean up`);
      
      for (const user of response.data.users) {
        console.log(`🗑️  Deleting test user: ${user.email}`);
        
        try {
          await axios.delete(`${API_BASE}/auth/test-users/${user._id}`);
          console.log(`✅ Deleted user: ${user.email}`);
        } catch (error) {
          console.log(`❌ Failed to delete user ${user.email}:`, error.response?.data?.message || error.message);
        }
      }
      
      console.log('\n✅ Cleanup completed!');
    } else {
      console.log('ℹ️  No test users found to clean up');
    }
    
  } catch (error) {
    console.log('❌ Error during cleanup:', error.response?.data?.message || error.message);
    console.log('💡 This endpoint might not exist yet. You can manually delete test users from the database.');
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
  console.log('🧹 Test Users Cleanup\n');
  
  // Verificar conexión del servidor
  const serverOk = await testServerConnection();
  if (!serverOk) {
    console.log('\n❌ Cannot continue without server connection');
    return;
  }
  
  // Limpiar usuarios de prueba
  await cleanupTestUsers();
  
  console.log('\n✅ Cleanup process completed!');
  console.log('\n💡 You can now run: node setup-test-user.cjs to create a fresh test user');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { cleanupTestUsers, testServerConnection }; 