# Videos de Tutoriales de YouTube - GrammarMasterPro

## 🎥 Videos de YouTube

Este sistema utiliza videos de YouTube embebidos para los tutoriales de cada tema gramatical.

## 📋 Configuración de Videos

Para cada tema gramatical, necesitas proporcionar la URL completa de YouTube del video tutorial:

| Tema | Campo en grammarTopics.ts |
|------|---------------------------|
| Present Tenses | `youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID'` |
| Past Tenses | `youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID'` |
| Conditionals | `youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID'` |
| Prepositions | `youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID'` |
| Articles | `youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID'` |
| Modal Verbs | `youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID'` |

## 🔧 Cómo Configurar los Videos

### Paso 1: Encontrar Videos de YouTube
Busca videos educativos de YouTube que expliquen cada tema gramatical. Algunas sugerencias:

- **Present Tenses**: Videos sobre Present Simple, Present Continuous, Present Perfect
- **Past Tenses**: Videos sobre Past Simple, Past Continuous, Past Perfect
- **Conditionals**: Videos sobre los 4 tipos de condicionales
- **Prepositions**: Videos sobre preposiciones de tiempo, lugar y movimiento
- **Articles**: Videos sobre el uso de A, An, The
- **Modal Verbs**: Videos sobre can, could, may, might, must, should, etc.

### Paso 2: Obtener las URLs
1. Ve al video de YouTube que quieres usar
2. Copia la URL completa del navegador
3. Ejemplo: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

### Paso 3: Actualizar el Código
Edita el archivo `src/data/grammarTopics.ts` y reemplaza las URLs de ejemplo:

```typescript
export const grammarTopics: GrammarTopic[] = [
  {
    id: 'present-tenses',
    title: 'PRESENT TENSES',
    description: 'Practice Using Present Simple, Present Continuous, And Present Perfect Tenses Correctly.',
    icon: 'Clock',
    difficulty: 'easy',
    completedPercentage: 75,
    youtubeUrl: 'https://www.youtube.com/watch?v=TU_VIDEO_ID_REAL', // Reemplaza con tu URL real
  },
  // ... otros temas
];
```

## 🎯 Características del Reproductor de YouTube

El sistema incluye:

- **✅ Reproducción embebida**: Los videos se reproducen directamente en la aplicación
- **✅ Controles personalizados**: Barra de progreso y botones de control
- **✅ Simulación de progreso**: El sistema simula el progreso del video (100 segundos)
- **✅ Botón "Saltar Tutorial"**: Permite saltar el tutorial y ir directamente al juego
- **✅ Botón "Repetir Tutorial"**: Permite volver a ver el tutorial
- **✅ Detección de finalización**: Habilita automáticamente el botón "Start Game"

## 📝 Formato de URLs Soportadas

El sistema acepta cualquier formato de URL de YouTube:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`

## 🎬 Ejemplo de Configuración Completa

```typescript
// En src/data/grammarTopics.ts
export const grammarTopics: GrammarTopic[] = [
  {
    id: 'present-tenses',
    title: 'PRESENT TENSES',
    description: 'Practice Using Present Simple, Present Continuous, And Present Perfect Tenses Correctly.',
    icon: 'Clock',
    difficulty: 'easy',
    completedPercentage: 75,
    youtubeUrl: 'https://www.youtube.com/watch?v=abc123def45', // Tu video real
  },
  {
    id: 'past-tenses',
    title: 'PAST TENSES',
    description: 'Learn When To Use Past Simple, Past Continuous, And Past Perfect Tenses.',
    icon: 'History',
    difficulty: 'medium',
    completedPercentage: 40,
    youtubeUrl: 'https://www.youtube.com/watch?v=xyz789ghi01', // Tu video real
  },
  // ... continuar para todos los temas
];
```

## 🚀 Cómo Usar

1. **Encuentra videos educativos** de YouTube para cada tema gramatical
2. **Copia las URLs** de los videos
3. **Actualiza** el archivo `src/data/grammarTopics.ts` con las URLs reales
4. **Ejecuta el proyecto**: `npm run dev`
5. **Navega a cualquier tema** y haz clic en "Start Tutorial"
6. **¡Disfruta de los tutoriales en video!** 🎉

## ⚠️ Notas Importantes

1. **Videos públicos**: Asegúrate de que los videos sean públicos o no tengan restricciones
2. **Duración recomendada**: Videos de 2-5 minutos funcionan mejor
3. **Idioma**: Los videos deben estar en inglés o español según tu preferencia
4. **Calidad**: Videos en HD (720p o 1080p) se ven mejor
5. **Contenido educativo**: Asegúrate de que los videos sean apropiados para el aprendizaje

## 🆘 Solución de Problemas

### El video no se reproduce
- Verifica que la URL sea correcta
- Asegúrate de que el video sea público
- Confirma que el video no tenga restricciones de edad

### El video no se carga
- Verifica la conexión a internet
- Confirma que la URL esté bien formateada
- Revisa la consola del navegador para errores

### Problemas de rendimiento
- Los videos de YouTube se cargan automáticamente
- El sistema simula el progreso para mantener la funcionalidad del juego

## 🎯 Ventajas de Usar YouTube

- **✅ No necesitas hospedar archivos grandes**
- **✅ Videos optimizados automáticamente**
- **✅ Reproducción en múltiples dispositivos**
- **✅ Controles nativos de YouTube**
- **✅ Fácil actualización de contenido**

---

¡Con estos pasos tendrás un sistema completo de tutoriales en video usando YouTube para tu aplicación GrammarMasterPro! 🎉 