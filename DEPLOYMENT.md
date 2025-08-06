# Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

## Configuración Automática

1. **GitHub Actions**: El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente cuando se hace push a la rama `main`.

2. **Build**: El proceso de build incluye:
   - Instalación de dependencias con `npm ci`
   - Compilación con `npm run build`
   - Despliegue automático a la rama `gh-pages`

## Configuración Manual

Si necesitas configurar GitHub Pages manualmente:

1. Ve a **Settings** > **Pages** en tu repositorio
2. En **Source**, selecciona **Deploy from a branch**
3. Selecciona la rama `gh-pages` y la carpeta `/ (root)`
4. Haz clic en **Save**

## Estructura de Archivos

- `.github/workflows/deploy.yml`: Workflow de GitHub Actions
- `public/_redirects`: Reglas de redirección para SPA
- `public/404.html`: Página 404 personalizada para GitHub Pages
- `vite.config.ts`: Configuración de Vite con base path para GitHub Pages

## Solución de Problemas

### Error de MIME Type
Si ves el error "Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'", esto se soluciona con:

1. La configuración correcta en `vite.config.ts`
2. Los scripts de redirección en `index.html` y `404.html`
3. El archivo `_redirects` en la carpeta `public`

### Rutas no funcionan
Si las rutas de la aplicación no funcionan correctamente:

1. Verifica que el `base` en `vite.config.ts` coincida con el nombre de tu repositorio
2. Asegúrate de que los scripts de redirección estén presentes en `index.html`
3. El archivo `404.html` debe estar en la carpeta `public`

## Variables de Entorno

- `NODE_ENV=production`: Se establece automáticamente durante el build
- `GITHUB_TOKEN`: Se proporciona automáticamente por GitHub Actions

## Comandos Útiles

```bash
# Build local para testing
npm run build

# Build para producción
npm run build:prod

# Preview local del build
npm run preview
```

## Notas Importantes

- El proyecto usa React Router para el enrutamiento
- Los assets se sirven desde `/project/` en producción (ajusta según tu nombre de repositorio)
- El build se optimiza para producción con chunks separados
- Se incluyen sourcemaps deshabilitados para mejor rendimiento 