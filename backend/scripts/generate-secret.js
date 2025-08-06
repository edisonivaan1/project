const crypto = require('crypto');

// Generar un JWT secret seguro
const generateJWTSecret = () => {
  const secret = crypto.randomBytes(64).toString('hex');
  console.log('🔐 JWT Secret generado:');
  console.log('='.repeat(50));
  console.log(secret);
  console.log('='.repeat(50));
  console.log('📝 Copia este secret y agrégalo como variable de entorno JWT_SECRET en Railway');
  return secret;
};

// Generar también un secret más corto para desarrollo
const generateShortSecret = () => {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('\n🔑 JWT Secret corto (para desarrollo):');
  console.log('='.repeat(50));
  console.log(secret);
  console.log('='.repeat(50));
  return secret;
};

if (require.main === module) {
  console.log('🚀 Generando JWT Secrets...\n');
  generateJWTSecret();
  generateShortSecret();
}

module.exports = { generateJWTSecret, generateShortSecret }; 