# 🗄️ Configuración de MongoDB Atlas

## 📋 Pasos para Configurar MongoDB Atlas

### **Paso 1: Crear Cuenta en MongoDB Atlas**

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea una cuenta gratuita
3. Completa el proceso de registro

### **Paso 2: Crear Cluster**

1. **Selecciona el plan gratuito** (M0 Free)
2. **Selecciona el proveedor**: AWS, Google Cloud, o Azure
3. **Selecciona la región**: La más cercana a tu ubicación
4. **Haz clic en "Create"**

### **Paso 3: Configurar Seguridad**

1. **Crear usuario de base de datos**:
   - Username: `grammar-master-admin`
   - Password: Genera una contraseña segura
   - Role: `Read and write to any database`

2. **Configurar IP Access**:
   - Ve a "Network Access"
   - Haz clic en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - Haz clic en "Confirm"

### **Paso 4: Obtener URI de Conexión**

1. Ve a "Database" en el menú lateral
2. Haz clic en "Connect"
3. Selecciona "Connect your application"
4. Copia la URI de conexión

### **Paso 5: Personalizar la URI**

La URI se verá así:
```
mongodb+srv://grammar-master-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Reemplaza:
- `<password>` con la contraseña que creaste
- Agrega el nombre de la base de datos: `grammar-master-pro`

**URI final**:
```
mongodb+srv://grammar-master-admin:tu-password@cluster0.xxxxx.mongodb.net/grammar-master-pro?retryWrites=true&w=majority
```

### **Paso 6: Configurar en Railway**

1. Ve a Railway y tu proyecto
2. Ve a la pestaña "Variables"
3. Agrega la variable:
   ```
   MONGODB_URI=mongodb+srv://grammar-master-admin:tu-password@cluster0.xxxxx.mongodb.net/grammar-master-pro?retryWrites=true&w=majority
   ```

## 🔧 Verificación

### **Probar Conexión Localmente**

1. Crea un archivo `.env` en la carpeta `backend/`:
   ```env
   MONGODB_URI=tu-uri-de-mongodb-atlas
   JWT_SECRET=tu-jwt-secret
   PORT=5000
   ```

2. Ejecuta el servidor:
   ```bash
   cd backend
   npm run dev
   ```

3. Verifica que se conecte correctamente:
   ```
   ✅ Conectado a MongoDB
   🚀 Server running on port 5000
   ```

## 🔒 Seguridad

### **Buenas Prácticas:**

1. **Contraseña fuerte**: Usa una contraseña compleja para el usuario de la base de datos
2. **IP Whitelist**: En producción, puedes restringir las IPs que pueden acceder
3. **Variables de entorno**: Nunca commits las credenciales al repositorio
4. **Backup regular**: Configura backups automáticos en MongoDB Atlas

### **Variables de Entorno Necesarias:**

```env
# Railway
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grammar-master-pro?retryWrites=true&w=majority
JWT_SECRET=tu-jwt-secret-super-seguro
PORT=5000
NODE_ENV=production
```

## 📊 Monitoreo

### **MongoDB Atlas Dashboard:**
- Ve a "Metrics" para ver el uso de la base de datos
- Ve a "Logs" para ver las conexiones
- Ve a "Alerts" para configurar notificaciones

### **Railway Logs:**
- Verifica que aparezca "Conectado a MongoDB" en los logs
- Si hay errores de conexión, verifica la URI y las credenciales 