import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';
// import gameRoutes from './routes/game';

const app = express();
const PORT = process.env.PORT || 5713;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API del juego funcionando correctamente' });
});

// Rutas
app.use('/api/auth', authRoutes);
// app.use('/api/game', gameRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'El servidor está funcionando correctamente' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicializar la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos inicializada');
    
    // Iniciar el servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Rutas disponibles:');
      console.log('- GET /');
      console.log('- GET /api/test');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
    });
  })
  .catch((error) => {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }); 