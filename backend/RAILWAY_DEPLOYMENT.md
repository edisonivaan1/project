# 🚀 Despliegue en Railway - Grammar Master Pro Backend

## 📋 Requisitos Previos

1. **Cuenta en Railway**: [railway.app](https://railway.app)
2. **Base de datos MongoDB**: Atlas o MongoDB local
3. **Variables de entorno configuradas**

## 🔧 Configuración en Railway

### **Paso 1: Crear Proyecto en Railway**

1. Ve a [Railway.app](https://railway.app)
2. Crea una cuenta (puedes usar GitHub)
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Conecta tu repositorio de GitHub
6. Selecciona la carpeta `backend` (no todo el proyecto)

### **Paso 2: Configurar Variables de Entorno**

En Railway, ve a la pestaña "Variables" y agrega:

```env
# Base de datos MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grammar-master-pro?retryWrites=true&w=majority

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-super-secret-jwt-key-aqui

# Puerto (Railway lo asigna automáticamente)
PORT=5000

# Entorno
NODE_ENV=production
```

### **Paso 3: Configurar Base de Datos**

**Opción A: MongoDB Atlas (Recomendada)**
1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Crea una base de datos llamada `grammar-master-pro`
5. Crea un usuario con permisos de lectura/escritura
6. Obtén la URI de conexión
7. Agrega la URI a las variables de entorno en Railway

**Opción B: MongoDB en Railway**
1. En Railway, ve a "New Service"
2. Selecciona "Database" → "MongoDB"
3. Railway creará automáticamente las variables de entorno

### **Paso 4: Desplegar**

1. Railway detectará automáticamente que es un proyecto Node.js
2. El archivo `railway.json` configurará el despliegue
3. Railway ejecutará `npm start` automáticamente
4. El servicio estará disponible en una URL como: `https://tu-app.railway.app`

### **Paso 5: Verificar el Despliegue**

1. Ve a la pestaña "Deployments" en Railway
2. Verifica que el despliegue sea exitoso
3. Haz clic en la URL generada
4. Deberías ver: `{"success":true,"message":"Grammar Master Pro Backend is running!"}`

### **Paso 6: Inicializar la Base de Datos**

1. Ve a la pestaña "Variables" en Railway
2. Agrega una variable temporal: `INIT_DB=true`
3. Railway reiniciará el servicio
4. El script de inicialización se ejecutará automáticamente
5. Remueve la variable `INIT_DB` después de la inicialización

## 🔗 Configurar Frontend

Una vez que tengas la URL del backend (ej: `https://tu-app.railway.app`), actualiza el frontend:

### **Actualizar `src/services/api.ts`:**

```typescript
const getApiBaseUrl = () => {
  // Si estamos en GitHub Pages (producción)
  if (window.location.hostname === 'edisonivaan1.github.io') {
    return 'https://tu-app.railway.app/api'; // ← Tu URL de Railway
  }
  
  // Desarrollo local
  return 'http://localhost:5000/api';
};
```

## 📊 Monitoreo

### **Logs en Railway:**
- Ve a la pestaña "Deployments"
- Haz clic en el deployment más reciente
- Ve a "Logs" para ver los logs en tiempo real

### **Health Check:**
- URL: `https://tu-app.railway.app/api/health`
- Debería responder con estado 200

## 🔧 Solución de Problemas

### **Error: "Cannot connect to MongoDB"**
- Verifica que `MONGODB_URI` esté correctamente configurada
- Asegúrate de que la IP de Railway esté en la whitelist de MongoDB Atlas

### **Error: "JWT_SECRET is not defined"**
- Agrega la variable `JWT_SECRET` en Railway
- Genera un secret seguro: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### **Error: "Port already in use"**
- Railway asigna automáticamente el puerto
- Usa `process.env.PORT` en lugar de un puerto fijo

### **Error: "CORS policy"**
- El backend ya está configurado para aceptar peticiones desde GitHub Pages
- Verifica que la URL del frontend esté en la lista de orígenes permitidos

## ✅ Verificación Final

1. **Backend funcionando**: `https://tu-app.railway.app/api/health`
2. **Base de datos conectada**: Logs muestran "Conectado a MongoDB"
3. **Frontend actualizado**: Con la nueva URL del backend
4. **Login funcionando**: Desde GitHub Pages
5. **Todas las funcionalidades operativas**

## 🚀 URLs Finales

- **Frontend**: `https://edisonivaan1.github.io/project/`
- **Backend**: `https://tu-app.railway.app`
- **API Health**: `https://tu-app.railway.app/api/health` 