const express = require('express');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const { User } = require('../entities/User');

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar datos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'El formato del email no es válido' 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: [
        { email },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El usuario o email ya existe' 
      });
    }

    // Crear nuevo usuario
    const user = userRepository.create({
      username,
      email,
      password
    });

    await userRepository.save(user);

    // Generar token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error al registrar usuario. Por favor, intente nuevamente.' 
    });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión. Por favor, intente nuevamente.' 
    });
  }
});

module.exports = router; 