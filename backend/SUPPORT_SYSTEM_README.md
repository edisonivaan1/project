# Sistema de Soporte - Grammar Master Pro

## 📝 Descripción
Sistema completo de soporte que permite a los usuarios enviar consultas y mensajes que se almacenan en la base de datos MongoDB.

## 🚀 Características

### ✅ Para Usuarios
- Envío de mensajes desde la página de ayuda (`/help`)
- Categorización automática de consultas
- Email opcional para respuestas directas
- Feedback visual de estado (éxito/error)
- Límite de 2000 caracteres por mensaje
- Contador de caracteres en tiempo real

### ✅ Para Administradores
- Vista de todos los mensajes de soporte
- Filtrado por estado y categoría
- Actualización de estados de mensajes
- Estadísticas del sistema de soporte
- Notas administrativas

## 📊 Estructura de Datos

### SupportMessage Model
```javascript
{
  message: String,           // Mensaje del usuario (requerido)
  userId: ObjectId,          // ID del usuario (opcional)
  userEmail: String,         // Email del usuario (opcional)
  status: String,            // open, in_progress, resolved, closed
  priority: String,          // low, medium, high, urgent
  category: String,          // technical, content, account, feedback, other
  userAgent: String,         // Información del navegador
  ipAddress: String,         // IP del usuario
  resolved: Boolean,         // Si está resuelto
  resolvedAt: Date,          // Fecha de resolución
  resolvedBy: ObjectId,      // Admin que resolvió
  adminNotes: String,        // Notas del administrador
  createdAt: Date,           // Fecha de creación (automática)
  updatedAt: Date            // Fecha de actualización (automática)
}
```

## 🛠️ API Endpoints

### Públicos
- `POST /api/support/message` - Enviar mensaje de soporte

### Privados (requieren autenticación)
- `GET /api/support/messages` - Listar mensajes (Admin)
- `PUT /api/support/messages/:id/status` - Actualizar estado (Admin)
- `GET /api/support/stats` - Estadísticas (Admin)

## 💻 Ejemplos de Uso

### Enviar Mensaje (Frontend)
```typescript
const response = await supportService.submitMessage({
  message: "Tengo un problema con el juego",
  category: "technical",
  userEmail: "usuario@ejemplo.com"
});
```

### Obtener Mensajes (Admin)
```typescript
const messages = await supportService.getMessages({
  status: "open",
  category: "technical",
  page: 1,
  limit: 10
});
```

### Actualizar Estado (Admin)
```typescript
await supportService.updateMessageStatus(
  messageId, 
  "resolved", 
  "Problema solucionado"
);
```

## 🔧 Configuración

### Inicializar Sistema
```bash
cd backend
node scripts/init-support.js
```

### Variables de Entorno
Asegúrate de que estas variables estén configuradas:
- `MONGODB_URI` - URL de conexión a MongoDB
- `JWT_SECRET` - Secreto para tokens JWT

## 📋 Categorías Disponibles

| Categoría | Descripción |
|-----------|-------------|
| `technical` | Problemas técnicos del juego |
| `content` | Contenido educativo |
| `account` | Problemas de cuenta de usuario |
| `feedback` | Sugerencias y comentarios |
| `other` | Otras consultas |

## 📈 Estados de Mensajes

| Estado | Descripción |
|--------|-------------|
| `open` | Mensaje nuevo, pendiente |
| `in_progress` | En proceso de resolución |
| `resolved` | Resuelto por el equipo |
| `closed` | Cerrado definitivamente |

## 🎯 Características de Accesibilidad

- Formulario completamente accesible con teclado
- Labels apropiados para lectores de pantalla
- Mensajes de estado con íconos visuales
- Validación en tiempo real
- Feedback inmediato al usuario

## 🔄 Flujo de Trabajo

1. **Usuario**: Envía mensaje desde `/help`
2. **Sistema**: Guarda en BD con estado "open"
3. **Admin**: Revisa mensajes en panel de administración
4. **Admin**: Actualiza estado a "in_progress" o "resolved"
5. **Sistema**: Registra timestamps y admin que resolvió

## 🚨 Consideraciones de Seguridad

- Validación de entrada en frontend y backend
- Límites de longitud en mensajes
- Rate limiting recomendado para prevenir spam
- Logs de IP para auditoria
- Sanitización de datos antes de almacenar

## 📞 Soporte Técnico

Para problemas con el sistema de soporte, revisa:
1. Conexión a MongoDB
2. Variables de entorno
3. Logs del servidor
4. Permisos de usuario

---

**Desarrollado para Grammar Master Pro**  
*Sistema de aprendizaje de gramática inglesa*