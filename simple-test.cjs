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
      console.log('✅ Progress endpoint working');
      
      // Test achievements check
      console.log('\n4. Testing achievements check...');
      const checkResponse = await axios.post('http://localhost:5000/api/achievements/check', {
        context: {}
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('🏆 Achievement check result:', JSON.stringify(checkResponse.data, null, 2));
      
      // Test unnotified achievements
      console.log('\n5. Testing unnotified achievements...');
      const unnotifiedResponse = await axios.get('http://localhost:5000/api/achievements/user/unnotified', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('🔔 Unnotified achievements:', JSON.stringify(unnotifiedResponse.data, null, 2));
      
      // Test user achievements
      console.log('\n6. Testing user achievements...');
      const userAchievementsResponse = await axios.get('http://localhost:5000/api/achievements/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📊 User achievements count:', userAchievementsResponse.data.data?.length || 0);
      
      // Show completed levels if any
      const completedLevels = progressResponse.data.data?.levels?.filter(l => l.isCompleted) || [];
      console.log(`\n📈 Completed levels: ${completedLevels.length}`);
      if (completedLevels.length > 0) {
        completedLevels.forEach(level => {
          console.log(`  - ${level.topicId} (${level.difficulty}): ${level.bestScore.percentage}%`);
        });
      }
      
      console.log('\n🎉 All achievement tests completed!');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
  }
}

simpleTest(); 