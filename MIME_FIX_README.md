# Solución para el Error de Tipos MIME en JavaScript

## Problema
El error **"Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'"** ocurre cuando el servidor no está configurado correctamente para servir archivos JavaScript con el tipo MIME correcto.

## Soluciones Implementadas

### 1. Servidor Node.js Personalizado (`server.js`)
Se ha creado un servidor Express que configura automáticamente los tipos MIME correctos:

```bash
# Instalar dependencias
npm install express

# Ejecutar el servidor
npm run serve

# O construir y servir en producción
npm run serve:prod
```

### 2. Configuración de Vite (`vite.config.ts`)
Se ha actualizado la configuración de Vite para manejar mejor los tipos de archivos:

- Configuración específica para archivos JavaScript
- Manejo correcto de archivos de audio e imagen
- Headers personalizados para el servidor de desarrollo

### 3. Archivos de Configuración para Diferentes Servidores

#### GitHub Pages (`dist/_headers`)
```apache
*.js
  Content-Type: application/javascript

*.mjs
  Content-Type: application/javascript

*.css
  Content-Type: text/css

*.html
  Content-Type: text/html

*.mp3
  Content-Type: audio/mpeg

*.wav
  Content-Type: audio/wav
```

#### Apache (`.htaccess`)
```apache
AddType application/javascript .js
AddType application/javascript .mjs
AddType audio/mpeg .mp3
AddType audio/wav .wav
```

#### Nginx (`nginx.conf`)
```nginx
location ~* \.js$ {
    add_header Content-Type application/javascript;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Cómo Usar las Soluciones

### Opción 1: Servidor Node.js (Recomendado)
```bash
# Instalar dependencias
npm install

# Construir el proyecto
npm run build

# Ejecutar el servidor personalizado
npm run serve
```

### Opción 2: Servidor de Desarrollo de Vite
```bash
# Ejecutar en modo desarrollo
npm run dev
```

### Opción 3: Preview de Vite
```bash
# Construir y previsualizar
npm run build
npm run preview
```

## Verificación

Para verificar que los tipos MIME están configurados correctamente:

1. **Abrir las herramientas de desarrollo del navegador** (F12)
2. **Ir a la pestaña Network**
3. **Recargar la página**
4. **Buscar archivos .js** y verificar que el `Content-Type` sea `application/javascript`

## Archivos Modificados

1. `vite.config.ts` - Configuración de Vite actualizada
2. `server.js` - Servidor Express personalizado
3. `package.json` - Dependencias y scripts actualizados
4. `dist/_headers` - Configuración para GitHub Pages
5. `dist/.htaccess` - Configuración para Apache
6. `nginx.conf` - Configuración para Nginx

## Solución de Problemas

### Si el error persiste:

1. **Limpiar la caché del navegador**
2. **Verificar que el servidor esté ejecutándose correctamente**
3. **Comprobar que los archivos se estén sirviendo desde el directorio correcto**
4. **Verificar las cabeceras HTTP en las herramientas de desarrollo**

### Para diferentes entornos:

- **Desarrollo local**: Usar `npm run dev` o `npm run serve`
- **GitHub Pages**: El archivo `_headers` se aplica automáticamente
- **Apache**: Copiar `.htaccess` al directorio raíz
- **Nginx**: Usar la configuración de `nginx.conf`

## Comandos Útiles

```bash
# Construir el proyecto
npm run build

# Ejecutar servidor personalizado
npm run serve

# Ejecutar servidor de desarrollo
npm run dev

# Previsualizar build
npm run preview

# Instalar dependencias
npm install
```

## Notas Importantes

- El servidor personalizado (`server.js`) es la solución más confiable
- Los archivos de configuración para diferentes servidores están incluidos como respaldo
- La configuración de Vite se ha optimizado para manejar correctamente los tipos de archivos
- Todos los archivos JavaScript ahora se sirven con `Content-Type: application/javascript` 