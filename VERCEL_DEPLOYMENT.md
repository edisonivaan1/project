# 🚀 Despliegue en Vercel - Grammar Master Pro

## 📋 Requisitos Previos

1. **Cuenta en Vercel**: [vercel.com](https://vercel.com)
2. **Base de datos MongoDB**: Atlas (ya configurada)
3. **Repositorio en GitHub**: Con todo el código

## 🔧 Configuración en Vercel

### **Paso 1: Crear Cuenta en Vercel**

1. Ve a [Vercel.com](https://vercel.com)
2. Crea una cuenta (puedes usar GitHub)
3. Haz clic en "New Project"
4. Conecta tu repositorio de GitHub

### **Paso 2: Configurar Variables de Entorno**

En Vercel, ve a "Settings" → "Environment Variables" y agrega:

```env
# Base de datos MongoDB
MONGODB_URI=mongodb+srv://saidluna116:T3iwaYBCMe9Q2qZq@usabilidad.n1dphqq.mongodb.net/grammar_master_pro

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-jwt-secret-super-seguro

# Entorno
NODE_ENV=production
```

### **Paso 3: Configurar Build Settings**

En Vercel, configura:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### **Paso 4: Desplegar**

1. Vercel detectará automáticamente la configuración
2. El archivo `vercel.json` configurará el despliegue
3. Vercel desplegará tanto frontend como backend
4. Obtendrás una URL como: `https://grammar-master-pro.vercel.app`

## 🔗 URLs Finales

Una vez desplegado:

- **Aplicación completa**: `https://grammar-master-pro.vercel.app`
- **API Backend**: `https://grammar-master-pro.vercel.app/api`
- **Health Check**: `https://grammar-master-pro.vercel.app/api/health`

## 📊 Monitoreo

### **Logs en Vercel:**
- Ve a tu proyecto en Vercel
- Haz clic en "Functions" para ver los logs del backend
- Ve a "Deployments" para ver el historial

### **Health Check:**
- URL: `https://grammar-master-pro.vercel.app/api/health`
- Debería responder con estado 200

## 🔧 Solución de Problemas

### **Error: "Cannot connect to MongoDB"**
- Verifica que `MONGODB_URI` esté correctamente configurada en Vercel
- Asegúrate de que la IP de Vercel esté en la whitelist de MongoDB Atlas

### **Error: "JWT_SECRET is not defined"**
- Agrega la variable `JWT_SECRET` en Vercel
- Genera un secret seguro

### **Error: "CORS policy"**
- El backend ya está configurado para aceptar peticiones desde Vercel
- Verifica que la URL del frontend esté en la lista de orígenes permitidos

## ✅ Verificación Final

1. **Aplicación funcionando**: `https://grammar-master-pro.vercel.app`
2. **Base de datos conectada**: Health check responde correctamente
3. **Login funcionando**: Desde cualquier dispositivo
4. **Todas las funcionalidades operativas**

## 🚀 Ventajas de Vercel

- ✅ **Un solo dominio** para frontend y backend
- ✅ **Despliegue automático** desde GitHub
- ✅ **Escalabilidad automática**
- ✅ **CDN global** para mejor rendimiento
- ✅ **SSL automático**
- ✅ **Gratis** para proyectos pequeños

## 🔄 Migración desde Railway

Una vez que Vercel esté funcionando:

1. **Actualiza las URLs** en el código
2. **Prueba todas las funcionalidades**
3. **Puedes mantener Railway como respaldo** temporalmente
4. **Actualiza la documentación** con las nuevas URLs 