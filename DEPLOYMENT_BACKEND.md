# Guía para Desplegar el Backend en Railway

## 🚀 Despliegue del Backend

### **Paso 1: Preparar el Backend**

1. **Crear archivo `railway.json` en la carpeta `backend/`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Verificar que `backend/package.json` tenga el script start**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### **Paso 2: Desplegar en Railway**

1. **Ir a [Railway.app](https://railway.app)**
2. **Crear cuenta** (puedes usar GitHub)
3. **Crear nuevo proyecto**
4. **Conectar tu repositorio de GitHub**
5. **Seleccionar la carpeta `backend`**
6. **Railway detectará automáticamente que es Node.js**

### **Paso 3: Configurar Variables de Entorno**

En Railway, ve a la pestaña "Variables" y agrega:
```
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_jwt_secret
PORT=5000
```

### **Paso 4: Obtener la URL del Backend**

Una vez desplegado, Railway te dará una URL como:
`https://tu-app.railway.app`

### **Paso 5: Actualizar el Frontend**

Una vez tengas la URL del backend, actualiza `src/services/api.ts`:

```typescript
const getApiBaseUrl = () => {
  // Si estamos en GitHub Pages (producción)
  if (window.location.hostname === 'edisonivaan1.github.io') {
    return 'https://tu-app.railway.app/api'; // ← Cambiar por tu URL de Railway
  }
  
  // Desarrollo local
  return 'http://localhost:5000/api';
};
```

## 🔧 Alternativas de Despliegue

### **Opción A: Render.com**
- Gratis
- Fácil de configurar
- Soporte para MongoDB

### **Opción B: Heroku**
- Tiene capa gratuita limitada
- Muy establecido
- Buena documentación

### **Opción C: Vercel**
- Gratis
- Optimizado para Node.js
- Despliegue automático

## 📝 Pasos Rápidos para Railway

1. **Crear cuenta en Railway**
2. **Conectar repositorio**
3. **Seleccionar carpeta `backend`**
4. **Configurar variables de entorno**
5. **Obtener URL del backend**
6. **Actualizar frontend con la nueva URL**
7. **Hacer commit y push**

## ✅ Verificación

Después del despliegue:
- ✅ Backend accesible desde cualquier lugar
- ✅ Base de datos funcionando
- ✅ Login funcionando desde GitHub Pages
- ✅ Todas las funcionalidades operativas 