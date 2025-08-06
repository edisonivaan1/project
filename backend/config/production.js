// Configuración para producción (Railway)
module.exports = {
  // Configuración de la base de datos
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Configuración del servidor
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0' // Importante para Railway
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },

  // Configuración de CORS para producción
  cors: {
    origin: [
      'https://edisonivaan1.github.io',
      'https://edisonivaan1.github.io/project',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    credentials: true
  },

  // Configuración de logs
  logging: {
    level: 'info',
    format: 'combined'
  }
}; 