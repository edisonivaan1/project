# Guía de Despliegue en GitHub Pages

## Problema Identificado

El error `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"` ocurre porque GitHub Pages no está sirviendo los archivos JavaScript con el tipo MIME correcto.

## Solución Implementada

### 1. Configuración de Vite
- Se agregó `base: '/project/'` en `vite.config.ts` para el repositorio
- Se configuraron manual chunks para mejor optimización

### 2. Archivos de Configuración para GitHub Pages
- `_headers`: Configuración de tipos MIME
- `_redirects`: Manejo de rutas de SPA
- `_config.yml`: Configuración de Jekyll
- `404.html`: Página de error personalizada para SPA

### 3. Script de Corrección de Tipos MIME
- `scripts/fix-mime-types.js`: Agrega comentarios de tipo MIME a archivos JS

## Pasos para Desplegar

1. **Hacer commit de los cambios:**
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment with correct MIME types"
   git push origin main
   ```

2. **Ejecutar build con corrección de tipos MIME:**
   ```bash
   npm run build:deploy
   ```

3. **Configurar GitHub Pages:**
   - Ir a Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

4. **Verificar el despliegue:**
   - Esperar a que se complete el despliegue
   - Visitar https://edisonivaan1.github.io/project/

## Archivos Críticos

- `vite.config.ts`: Configuración de base path
- `dist/_headers`: Tipos MIME para GitHub Pages
- `dist/_redirects`: Redirecciones de SPA
- `dist/spa-redirect.js`: Script de redirección
- `scripts/fix-mime-types.js`: Corrección de tipos MIME

## Troubleshooting

Si el problema persiste:

1. Verificar que el repositorio se llame exactamente `project`
2. Asegurar que la rama principal sea `main`
3. Verificar que GitHub Pages esté configurado correctamente
4. Limpiar caché del navegador (Ctrl+F5)

## Notas Importantes

- GitHub Pages no procesa archivos `.htaccess`
- Los tipos MIME se manejan a través de `_headers`
- Las rutas de SPA se manejan con `_redirects`
- El base path debe coincidir con el nombre del repositorio 