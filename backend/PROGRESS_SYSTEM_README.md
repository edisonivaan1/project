# Sistema de Progreso - Grammar Master Pro

## 📋 Resumen

Se ha implementado un nuevo sistema de progreso que separa los datos en dos colecciones MongoDB especializadas:

- **`attempts`**: Almacena cada intento individual de un usuario en un nivel específico
- **`progresses`**: Mantiene el progreso general de cada usuario en cada combinación de topic/dificultad

## 🗄️ Estructura de Colecciones

### Colección `attempts`
Cada documento representa un intento individual:

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia al usuario
  topicId: String, // ID del topic ('present-tenses', 'past-tenses', etc.)
  difficulty: String, // 'easy', 'medium', 'hard'
  score: {
    correct: Number, // Respuestas correctas
    total: Number,   // Total de preguntas
    percentage: Number // Porcentaje calculado automáticamente
  },
  timeSpent: Number, // Tiempo en segundos
  hintsUsed: Number, // Número de pistas utilizadas
  questionsDetails: [{ // Detalle opcional de cada pregunta
    questionId: String,
    userAnswer: Mixed,
    correctAnswer: Mixed,
    isCorrect: Boolean,
    timeSpent: Number,
    hintsUsed: Number
  }],
  completedAt: Date, // Cuándo se completó el intento
  createdAt: Date,
  updatedAt: Date
}
```

### Colección `progresses`
Cada documento representa el progreso de un usuario en un nivel específico:

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Referencia al usuario
  topicId: String, // ID del topic
  difficulty: String, // 'easy', 'medium', 'hard'
  isCompleted: Boolean, // Si el nivel está completado (>=70%)
  bestScore: {
    correct: Number,
    total: Number,
    percentage: Number
  },
  totalAttempts: Number, // Total de intentos realizados
  firstCompletedAt: Date, // Cuándo se completó por primera vez
  lastAttemptAt: Date, // Último intento realizado
  averageScore: Number, // Promedio de todos los intentos
  totalTimeSpent: Number, // Tiempo total en segundos
  totalHintsUsed: Number, // Total de pistas utilizadas
  isLocked: Boolean, // Si el nivel está bloqueado
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 API Endpoints

### Obtener progreso completo
```http
GET /api/progress
Authorization: Bearer <token>
```

### Registrar un intento
```http
POST /api/progress/complete-level
Authorization: Bearer <token>
Content-Type: application/json

{
  "topicId": "present-tenses",
  "difficulty": "easy",
  "correct": 8,
  "total": 10,
  "timeSpent": 120, // opcional
  "hintsUsed": 2,   // opcional
  "questionsDetails": [] // opcional
}
```

### Obtener progreso de un nivel específico
```http
GET /api/progress/level/:topicId/:difficulty
Authorization: Bearer <token>
```

### Obtener dificultades desbloqueadas
```http
GET /api/progress/unlocked-difficulties
Authorization: Bearer <token>
```

### Obtener historial de intentos
```http
GET /api/progress/attempts?topicId=present-tenses&difficulty=easy&limit=10
Authorization: Bearer <token>
```

### Obtener estadísticas
```http
GET /api/progress/stats?topicId=present-tenses
Authorization: Bearer <token>
```

### Reiniciar progreso (solo desarrollo)
```http
POST /api/progress/reset
Authorization: Bearer <token>
```

## 🔐 Lógica de Desbloqueo

### Dificultades Desbloqueadas:
- **Easy**: Siempre disponible
- **Medium**: Se desbloquea al completar 4 o más topics en Easy
- **Hard**: Se desbloquea al completar 4 o más topics en Medium

### Criterio de Completación:
Un nivel se considera completado cuando el usuario obtiene **70% o más** de respuestas correctas.

## 📊 Topics Disponibles

1. **present-tenses** - Present Tenses
2. **past-tenses** - Past Tenses  
3. **conditionals** - Conditionals
4. **prepositions** - Participles as Adjectives
5. **articles** - Gerunds and Infinitives
6. **modal-verbs** - Modal and Adverbs

## 🔄 Migración de Datos Existentes

Para migrar usuarios existentes con datos en el formato anterior:

```bash
# Ir al directorio del backend
cd backend

# Ejecutar script de migración
node scripts/migrate-progress.js

# Para ver ayuda
node scripts/migrate-progress.js --help

# Para ejecutar sin confirmación
node scripts/migrate-progress.js --force
```

## 📝 Cambios en el Modelo User

El modelo `User` se ha simplificado:

### Removido:
- Campo `gameProgress` embebido
- Métodos `updateLevelProgress()`, `updateUnlockedDifficulties()`, etc.

### Agregado:
- Método `getGameProgress()` que obtiene datos de las nuevas colecciones
- Middleware post-save para inicializar progreso en nuevos usuarios

## 🎯 Ventajas del Nuevo Sistema

### 🚀 Rendimiento
- **Consultas más rápidas**: Índices optimizados para cada tipo de consulta
- **Escalabilidad**: Las colecciones pueden crecer independientemente
- **Agregaciones eficientes**: MongoDB puede usar índices específicos

### 📊 Análisis de Datos
- **Historial completo**: Cada intento se preserva para análisis detallado
- **Estadísticas granulares**: Tiempo, pistas, detalles por pregunta
- **Reportes avanzados**: Consultas complejas sin afectar rendimiento

### 🛠️ Mantenibilidad
- **Separación de responsabilidades**: Intentos vs progreso general
- **Flexibilidad**: Fácil agregar nuevos campos sin afectar otros datos
- **Debugging**: Datos más organizados y fáciles de rastrear

### 📈 Funcionalidades Futuras
- Analytics de comportamiento de usuarios
- Recomendaciones personalizadas
- Comparaciones entre usuarios
- Reportes de dificultad por pregunta

## 🔧 Consideraciones Técnicas

### Índices Optimizados
```javascript
// Attempts
{ userId: 1, topicId: 1, difficulty: 1 }
{ userId: 1, completedAt: -1 }
{ topicId: 1, difficulty: 1, completedAt: -1 }

// Progress
{ userId: 1, topicId: 1, difficulty: 1 } // unique
{ userId: 1, isCompleted: 1 }
{ userId: 1, lastAttemptAt: -1 }
```

### Validaciones
- Topics válidos según enum
- Dificultades válidas según enum  
- Puntajes coherentes (correct <= total)
- Referencias válidas a usuarios existentes

### Transacciones (Futuro)
Para garantizar consistencia entre `attempts` y `progresses`, se pueden implementar transacciones MongoDB en operaciones críticas.

## 🧪 Testing

### Datos de Prueba
```javascript
// Crear usuario de prueba
const user = await User.create({
  first_name: 'Test',
  last_name: 'User', 
  email: 'test@example.com',
  password_hash: 'password123',
  security_question: 'What is your favorite book?',
  security_answer_hash: 'test'
});

// El progreso se inicializa automáticamente
const progress = await Progress.getUserProgress(user._id);
console.log(progress); // Todos los levels inicializados
```

### API Testing
```bash
# Registrar un intento
curl -X POST http://localhost:5000/api/progress/complete-level \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "present-tenses",
    "difficulty": "easy", 
    "correct": 8,
    "total": 10
  }'
```

## 🔮 Roadmap Futuro

1. **Analytics Dashboard**: Panel de control para administradores
2. **Machine Learning**: Recomendaciones personalizadas de practice
3. **Gamificación**: Logros, badges, leaderboards
4. **A/B Testing**: Diferentes versiones de preguntas
5. **Adaptive Learning**: Dificultad dinámica basada en rendimiento

---

*Documentación actualizada: Enero 2024* 