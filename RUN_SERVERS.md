# 🚀 Cómo Ejecutar Backend + Frontend

## **Opción 1: Un Solo Comando (Recomendado)**
```bash
npm run dev:all
```
Esto ejecuta ambos servidores simultáneamente.

## **Opción 2: Scripts Separados**
```bash
# Terminal 1 - Backend (puerto 5000)
npm run dev:backend

# Terminal 2 - Frontend (puerto 5173)  
npm run dev:frontend
```

## **Opción 3: Manualmente**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (desde la raíz)
npm run dev
```

## **URLs**
- 🎯 **Frontend**: http://localhost:5173
- 🔧 **Backend**: http://localhost:5000
- 🩺 **Health Check**: http://localhost:5000/api/health

## **Verificar que funciona**
Después de ejecutar, deberías ver:
- ✅ Backend: "Server running on port 5000"
- ✅ Frontend: "Local: http://localhost:5173"
- ✅ Sin error de conexión en el login/registro

## **Solución de Problemas**
Si obtienes "Error de conexión":
1. Verifica que el backend esté en puerto 5000
2. Verifica que MongoDB Atlas esté conectado
3. Revisa la consola por errores

## **Para Detener**
- Presiona `Ctrl+C` en la terminal
- Si usas `dev:all`, presiona una sola vez para detener ambos 