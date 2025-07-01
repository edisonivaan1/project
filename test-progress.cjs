const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Función para hacer login y obtener token
async function login(email, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      console.log('✅ Login successful');
      return response.data.token;
    } else {
      console.log('❌ Login failed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Función para obtener progreso
async function getProgress(token) {
  try {
    const response = await axios.get(`${API_BASE}/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log('✅ Progress loaded successfully');
      console.log('📊 Progress data:', JSON.stringify(response.data.data, null, 2));
      return response.data.data;
    } else {
      console.log('❌ Failed to load progress:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Progress error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Función para completar un nivel
async function completeLevel(token, topicId, difficulty, correct, total) {
  try {
    const response = await axios.post(`${API_BASE}/progress/complete-level`, {
      topicId,
      difficulty,
      correct,
      total
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      console.log(`✅ Level completed: ${topicId} ${difficulty} - ${correct}/${total}`);
      console.log('🎯 Result:', JSON.stringify(response.data.data, null, 2));
      return response.data.data;
    } else {
      console.log('❌ Failed to complete level:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Complete level error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Función principal de prueba
async function testProgressSystem() {
  console.log('🚀 Testing Progress System...\n');
  
  // Para pruebas, usar credenciales de ejemplo
  const email = 'test@example.com';
  const password = 'password123';
  
  console.log('1. Testing login...');
  const token = await login(email, password);
  
  if (!token) {
    console.log('❌ Cannot continue without authentication');
    return;
  }
  
  console.log('\n2. Getting initial progress...');
  await getProgress(token);
  
  console.log('\n3. Testing level completion...');
  
  // Probar completar present-tenses easy con 100%
  await completeLevel(token, 'present-tenses', 'easy', 10, 10);
  
  console.log('\n4. Getting progress after first completion...');
  await getProgress(token);
  
  // Probar completar articles easy con 100%
  await completeLevel(token, 'articles', 'easy', 10, 10);
  
  console.log('\n5. Getting progress after second completion (should unlock medium)...');
  const finalProgress = await getProgress(token);
  
  if (finalProgress && finalProgress.unlockedDifficulties.includes('medium')) {
    console.log('🎉 SUCCESS: Medium difficulty unlocked as expected!');
  } else {
    console.log('⚠️  WARNING: Medium difficulty was not unlocked');
  }
  
  console.log('\n✅ Test completed!');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testProgressSystem().catch(console.error);
}

module.exports = { testProgressSystem, login, getProgress, completeLevel }; 