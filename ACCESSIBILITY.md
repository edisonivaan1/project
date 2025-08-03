# Guía de Accesibilidad - Grammar Master Pro

## Principios de Accesibilidad Implementados

Esta aplicación cumple con los principios de accesibilidad **Perceptible** y **Operable** de las WCAG 2.1.

## 🔍 Perceptible

### Alternativas para el Contenido No Textual

#### Imágenes con Alt Text Descriptivo
- **Logos**: Descripciones completas como "Grammar Master Pro - English Learning Platform Logo"
- **Imágenes de preguntas**: Alt text descriptivo basado en el contenido de la pregunta
- **Imágenes de perfil**: Alt text personalizado con el nombre del usuario
- **Imágenes de fondo**: Descripciones que explican el contexto educativo

```tsx
// Ejemplo de implementación
<img 
  src={profileImage} 
  alt={`${user.first_name} ${user.last_name}'s profile picture`}
  className="w-full h-full object-cover"
/>
```

#### Iconos Decorativos
- Todos los iconos decorativos incluyen `aria-hidden="true"`
- Los iconos funcionales tienen etiquetas descriptivas apropiadas

### Estructura Clara con Encabezados Jerárquicos

#### Jerarquía de Encabezados
- **H1**: Título principal de cada página
- **H2**: Secciones principales 
- **H3**: Subsecciones
- Implementación consistente en toda la aplicación

```tsx
// Estructura típica
<header>
  <h1>GRAMMAR MASTER PRO</h1>
</header>
<main>
  <section>
    <h2>Easy Level</h2>
    <h3>Present Tense</h3>
  </section>
</main>
```

## ⌨️ Operable

### Navegación por Teclado Completa

#### Elementos Focalizables
- **Todos los botones** son accesibles con Tab/Shift+Tab
- **Enlaces** incluyen estados de foco visibles
- **Tarjetas interactivas** responden a Enter y Espacio
- **Controles de drag-and-drop** tienen alternativas de teclado

```tsx
// Implementación de navegación por teclado
<Card
  tabIndex={isLocked ? -1 : 0}
  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
      e.preventDefault();
      navigate(`/tutorial/${topic.id}`);
    }
  }}
  role="button"
  aria-label={`${topic.title} - ${topic.difficulty} level`}
/>
```

#### Atajos de Teclado para Drag-and-Drop
- **Ctrl+1/2/3**: Seleccionar palabra de las opciones disponibles
- **1/2**: Colocar palabra seleccionada en espacio 1 o 2
- **Shift+1/2**: Seleccionar palabra desde espacio existente
- **Escape**: Cancelar selección actual
- **Delete**: Remover palabra del espacio seleccionado

### Estados de Foco Visibles

#### Estilos de Foco Mejorados
```css
/* Focus visible global */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Focus específico para elementos interactivos */
button:focus,
input:focus,
select:focus,
textarea:focus,
[tabindex]:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}
```

#### Indicadores Visuales
- **Hover**: Efectos de elevación y cambio de color
- **Focus**: Outline azul con sombra
- **Active**: Estados claramente diferenciados
- **Disabled**: Opacidad reducida y cursor not-allowed

### Navegación Consistente

#### Skip Links
- **Skip to main content** para usuarios de teclado
- Posicionado correctamente y visible al recibir foco

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

## 🎛️ Atributos ARIA Implementados

### Etiquetas y Descripciones

#### aria-label
```tsx
// Botones con contexto claro
<IconButton
  aria-label="Mute Background Music"
  tooltip="🎵 Mute Background Music"
/>

// Enlaces descriptivos
<Link 
  aria-label="Go to application settings"
  to="/settings"
>
  Settings
</Link>
```

#### aria-describedby y aria-labelledby
```tsx
// Barras de progreso
<ProgressBar 
  aria-label={`Topic progress: ${progress} percent complete`}
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
/>
```

### Estados y Propiedades

#### aria-current
```tsx
// Navegación activa
<Link 
  aria-current={isActive('/topics') ? 'page' : undefined}
  to="/topics"
>
  Topics
</Link>
```

#### aria-disabled
```tsx
// Elementos deshabilitados
<Card
  aria-disabled={isLocked}
  tabIndex={isLocked ? -1 : 0}
>
```

### Regiones Live

#### aria-live para Anuncios
```tsx
// Anuncios para lectores de pantalla en drag-and-drop
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
  role="status"
>
  {accessibilityAnnouncement}
</div>
```

## 🎨 Mejoras Visuales de Accesibilidad

### Contraste de Colores
- Texto principal: Mejorado de `text-gray-600` a `text-gray-700`
- Texto secundario: Mejorado de `text-gray-500` a `text-gray-600`
- Estados hover y focus con suficiente contraste

### Soporte para Preferencias del Usuario

#### Movimiento Reducido
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Alto Contraste
```css
@media (prefers-contrast: high) {
  button, .btn {
    border: 2px solid !important;
  }
  
  button:focus, .btn:focus {
    outline: 3px solid #000 !important;
  }
}
```

## 🧪 Testing de Accesibilidad

### Herramientas Recomendadas
1. **axe-core**: Para auditorías automáticas
2. **WAVE**: Evaluación web de accesibilidad
3. **Lighthouse**: Auditoría de accesibilidad integrada
4. **Screen readers**: NVDA, JAWS, VoiceOver para testing manual

### Checklist de Testing
- [ ] Navegación completa solo con teclado
- [ ] Todos los elementos interactivos son focalizables
- [ ] Lectores de pantalla anuncian correctamente los cambios
- [ ] Imágenes tienen alt text descriptivo
- [ ] Estructura de encabezados es lógica
- [ ] Contraste de colores cumple WCAG AA
- [ ] Estados de foco son claramente visibles

## 📋 Características Específicas por Componente

### Componentes UI Base
- **Button**: Focus ring, aria-label, estados disabled
- **IconButton**: Tooltips, screen reader text, aria-hidden para iconos
- **Card**: Soporte para tabindex, onKeyDown, roles
- **ProgressBar**: Atributos ARIA completos

### Páginas Principales
- **Home**: Estructura semántica, alt text descriptivo
- **TopicsPage**: Navegación por teclado, estados de bloqueo claros
- **Game**: Accesibilidad para drag-and-drop, anuncios live
- **Settings**: Controles claramente etiquetados
- **Profile**: Gestión accesible de imágenes

### Layout Components
- **Header**: Navegación principal accesible, skip links
- **Footer**: Enlaces sociales con etiquetas descriptivas
- **MainLayout**: Skip to content, estructura semántica

## 🚀 Beneficios de Implementación

### Para Usuarios
- **Usuarios con discapacidades visuales**: Navigation completa con lectores de pantalla
- **Usuarios de solo teclado**: Acceso completo a todas las funcionalidades
- **Usuarios con discapacidades motoras**: Targets de click grandes, estados claros
- **Todos los usuarios**: Mejor usabilidad y experiencia general

### Para Desarrolladores
- **Código más robusto**: Mejor estructura semántica
- **Mantenibilidad**: Componentes bien documentados y consistentes
- **SEO mejorado**: Mejor estructura para motores de búsqueda
- **Cumplimiento legal**: Adherencia a estándares de accesibilidad

## 📚 Recursos Adicionales

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

---

**Nota**: Esta implementación de accesibilidad es un proceso continuo. Se recomienda testing regular con usuarios reales y herramientas automatizadas para mantener y mejorar los estándares de accesibilidad.
