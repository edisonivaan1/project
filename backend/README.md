# Grammar Master Pro Backend

Backend API para la aplicación Grammar Master Pro, construido con Node.js, Express y MongoDB.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://saidluna116:T3iwaYBCMe9Q2qZq@usabilidad.n1dphqq.mongodb.net/grammar_master_pro
JWT_SECRET=tu_clave_secreta_jwt_aqui_cambiar_en_produccion
NODE_ENV=development
```

### 3. Ejecutar el Servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## 📊 Base de Datos

### Esquema de Usuario

```javascript
{
  first_name: String (requerido),
  last_name: String (requerido),
  email: String (único, requerido),
  password_hash: String (requerido),
  security_question: String (requerido, enum),
  security_answer_hash: String (requerido),
  createdAt: Date,
  updatedAt: Date
}
```

### Preguntas de Seguridad Disponibles

- "What is the name of your first pet?"
- "What is your mother's maiden name?"
- "What is your favorite book?"
- "What city were you born in?"

## 🔌 Endpoints de la API

### Autenticación

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "securityQuestion": "What is the name of your first pet?",
  "securityAnswer": "Fluffy"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "security_question": "What is the name of your first pet?",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Inicia sesión de usuario.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "security_question": "What is the name of your first pet?",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/forgot-password`
Obtiene la pregunta de seguridad para recuperación de contraseña.

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "securityQuestion": "What is the name of your first pet?",
  "email": "john@example.com"
}
```

#### POST `/api/auth/reset-password`
Restablece la contraseña usando la pregunta de seguridad.

**Body:**
```json
{
  "email": "john@example.com",
  "securityAnswer": "Fluffy",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

#### GET `/api/auth/me`
Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "security_question": "What is the name of your first pet?",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Health Check

#### GET `/api/health`
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "success": true,
  "message": "Grammar Master Pro Backend is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Seguridad

- Las contraseñas se hashean usando bcryptjs con salt de 12 rounds
- Las respuestas de seguridad se hashean y se normalizan (lowercase + trim)
- Los tokens JWT tienen una expiración de 30 días
- CORS configurado para frontend en desarrollo

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MongoDB
├── middleware/
│   └── auth.js              # Middleware de autenticación
├── models/
│   └── User.js              # Modelo de usuario
├── routes/
│   └── auth.js              # Rutas de autenticación
├── .env                     # Variables de entorno (crear)
├── package.json             # Dependencias del proyecto
├── README.md                # Este archivo
└── server.js                # Archivo principal del servidor
```

## 🛠️ Desarrollo

### Scripts Disponibles

- `npm start` - Ejecuta el servidor en modo producción
- `npm run dev` - Ejecuta el servidor en modo desarrollo con nodemon

### Testing de la API

Puedes usar herramientas como Postman, Insomnia o curl para probar los endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Registro de usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "securityQuestion": "What is the name of your first pet?",
    "securityAnswer": "Fluffy"
  }'
```

## 🚨 Errores Comunes

### Error de Conexión a MongoDB
- Verifica que la URI de MongoDB sea correcta
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas

### Error de Token JWT
- Verifica que el token se envíe en el header Authorization como `Bearer token`
- Asegúrate de que JWT_SECRET esté configurado

### Error CORS
- Verifica que el frontend esté ejecutándose en un puerto permitido en la configuración CORS

## 📚 Integración con Frontend

Para integrar con tu aplicación React, usa las siguientes URLs base:

- Desarrollo: `http://localhost:5000/api`
- Los endpoints devuelven siempre un objeto con `success`, `message` y datos adicionales 