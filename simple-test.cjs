const axios = require('axios');

async function simpleTest() {
  console.log('🔍 Simple API Test\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.data.message);
    
    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      
      // Test progress endpoint
      console.log('\n3. Testing progress endpoint...');
      const progressResponse = await axios.get('http://localhost:5000/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Progress endpoint working:', progressResponse.data);
      console.log('\n🎉 All tests passed!');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
  }
}

simpleTest(); 