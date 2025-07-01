// Script simple para probar la API de registro
const testRegister = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        securityQuestion: 'What is the name of your first pet?',
        securityAnswer: 'Fluffy'
      })
    });

    const data = await response.json();
    console.log('Registration Response:', data);

    if (response.ok) {
      console.log('✅ Registration successful!');
      return data;
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Login Response:', data);

    if (response.ok) {
      console.log('✅ Login successful!');
      return data;
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// Ejecutar las pruebas
console.log('🚀 Testing API endpoints...\n');

console.log('1. Testing Registration...');
testRegister().then(() => {
  console.log('\n2. Testing Login...');
  return testLogin();
}).then(() => {
  console.log('\n✅ All tests completed!');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 