# Guía de Accesibilidad - Grammar Master Pro

## Resumen
Grammar Master Pro ha sido desarrollado siguiendo las pautas de accesibilidad WCAG 2.1 nivel AA, con especial enfoque en los principios **Perceptible** y **Operable**.

## Características de Accesibilidad Implementadas

### 🎯 Principio Perceptible

#### Texto Alternativo Descriptivo
- **Imágenes**: Todas las imágenes incluyen texto alternativo descriptivo
- **Logotipos**: Descripción clara del propósito y marca
- **Iconos**: Marcados como decorativos (`aria-hidden="true"`) cuando corresponde
- **Imágenes de contenido**: Texto alternativo que describe el contenido y función

#### Estructura Jerárquica de Encabezados
- **H1**: Título principal de cada página
- **H2**: Secciones principales
- **H3**: Subsecciones
- **H4-H6**: Niveles adicionales según necesidad
- **Semántica**: Estructura lógica sin saltos de nivel

#### Información Visual Accesible
- **Contraste**: Cumple WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
- **Color**: La información no depende únicamente del color
- **Tamaños**: Textos escalables hasta 200% sin pérdida de funcionalidad

### ⌨️ Principio Operable

#### Navegación Completa por Teclado
- **Todos los elementos**: Navegables con `tabindex="0"`
- **Elementos interactivos**: Activables con Enter/Space
- **Elementos de contenido**: Focalizables para lectores de pantalla
- **Orden lógico**: Flujo de tabulación intuitivo

#### Teclas de Navegación Soportadas
```
Tab / Shift+Tab    → Navegación secuencial
Flechas ↑↓←→       → Navegación direccional
Home / End         → Ir al inicio/final
Page Up/Down       → Navegación por páginas (10 elementos)
Enter / Space      → Activar elementos
F1                 → Ayuda de navegación
Esc                → Cerrar modales
```

#### Skip Links (Enlaces de Salto)
- **Contenido principal**: Salta directamente al contenido
- **Navegación**: Acceso rápido al menú principal
- **Activación**: Enter para ejecutar el salto

#### Indicadores de Foco Visibles
- **Anillos de foco**: Visibles en todos los elementos
- **Colores**: Alto contraste (azul con borde blanco)
- **Consistencia**: Mismo estilo en toda la aplicación
- **Estados**: Diferenciación clara entre hover, focus y active

## Componentes Accesibles

### Botones
```tsx
// Ejemplo de botón accesible
<Button
  aria-label="Descripción clara de la acción"
  onKeyDown={handleKeyPress}
  className="focus:ring-2 focus:ring-blue-300"
>
  Texto del botón
</Button>
```

### Tarjetas Interactivas
```tsx
// Ejemplo de tarjeta accesible
<Card
  tabIndex={0}
  role="button"
  aria-label="Descripción del contenido"
  onKeyDown={handleCardKeyPress}
  onClick={handleCardClick}
>
  Contenido de la tarjeta
</Card>
```

### Navegación
```tsx
// Ejemplo de navegación accesible
<nav role="navigation" aria-label="Navegación principal">
  <Link 
    to="/topics"
    aria-current={isActive ? 'page' : undefined}
    aria-label="Descripción del enlace"
  >
    Temas
  </Link>
</nav>
```

## Tecnologías de Asistencia Soportadas

### Lectores de Pantalla
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)
- **Orca** (Linux)

### Navegación por Teclado
- **Teclados físicos**: Soporte completo
- **Teclados virtuales**: Compatible
- **Navegación por voz**: Dragon NaturallySpeaking
- **Conmutadores**: Switch Access

### Magnificadores de Pantalla
- **ZoomText** (Windows)
- **Zoom** (macOS)
- **Navegadores**: Zoom hasta 500%

## Hook Personalizado: useKeyboardNavigation

```tsx
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

const MyComponent = () => {
  const { focusFirst, focusLast, getNavigationStats } = useKeyboardNavigation({
    enableArrowKeys: true,
    enableHomeEnd: true,
    enablePageUpDown: true,
    onNavigate: (direction) => {
      console.log(`Navegando: ${direction}`);
    }
  });

  // Uso del hook...
};
```

## Estilos CSS de Accesibilidad

### Clases Utilitarias
```css
/* Solo para lectores de pantalla */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Visible cuando tiene foco */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Anillos de foco universales */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Estilos de Foco
```css
/* Elementos de contenido */
[tabindex="0"]:focus {
  outline: 2px dashed #3b82f6;
  outline-offset: 2px;
  background-color: rgba(59, 130, 246, 0.1);
}

/* Elementos interactivos */
button:focus,
a:focus,
input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
```

## Componente de Ayuda

### KeyboardNavigationHelp
- **Activación**: Botón flotante o tecla F1
- **Contenido**: Guía completa de navegación
- **Persistencia**: Recordar si ya se mostró
- **Escape**: Cerrar con tecla Esc

## Testing de Accesibilidad

### Herramientas Recomendadas
1. **axe DevTools**: Extensión de navegador
2. **WAVE**: Evaluador web de accesibilidad
3. **Lighthouse**: Auditoría integrada en Chrome
4. **Color Contrast Analyzer**: Verificar contrastes

### Pruebas Manuales
1. **Solo teclado**: Navegar sin mouse
2. **Lector de pantalla**: Probar con NVDA/VoiceOver
3. **Zoom**: Escalar hasta 200%
4. **Alto contraste**: Modo de Windows/macOS

### Lista de Verificación
- [ ] Todas las imágenes tienen alt text
- [ ] Navegación completa por teclado
- [ ] Anillos de foco visibles
- [ ] Estructura de encabezados lógica
- [ ] Skip links funcionales
- [ ] Contraste suficiente
- [ ] Etiquetas ARIA apropiadas
- [ ] Estados anunciados correctamente

## Configuración para Desarrolladores

### Extensiones VSCode Recomendadas
- **axe Accessibility Linter**: Detecta problemas de accesibilidad
- **Accessibility Insights**: Evaluación automatizada
- **Color Highlight**: Visualizar colores en CSS

### Scripts de Testing
```json
{
  "scripts": {
    "a11y-test": "axe-core src/",
    "contrast-check": "color-contrast-checker src/",
    "lighthouse-a11y": "lighthouse --only-categories=accessibility"
  }
}
```

## Recursos Adicionales

### Documentación WCAG
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Comunidad
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)

---

**Contacto**: Para reportar problemas de accesibilidad o sugerir mejoras, crear un issue en el repositorio con la etiqueta `accessibility`.

**Última actualización**: Diciembre 2024
