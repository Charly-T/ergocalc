# Configuración de GitHub Pages para ErgoCalc

## Aplicación React + Vite

Esta aplicación está construida con **React 18** y **Vite** para máxima compatibilidad y rendimiento en el ecosistema JavaScript estándar.

## Pasos para configurar GitHub Pages

### 1. Subir el código a GitHub

```bash
git init
git add .
git commit -m "Initial commit: ErgoCalc finger tracking app"
git branch -M main
git remote add origin https://github.com/tu-usuario/ergocalc.git
git push -u origin main
```

### 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Clickea en **Settings** (Configuración)
3. Scroll hasta la sección **Pages**
4. En **Source**, selecciona **GitHub Actions**

### 3. El workflow se ejecutará automáticamente

El archivo `.github/workflows/deploy.yml` se encargará de:
- Instalar dependencias
- Construir la aplicación
- Desplegar a GitHub Pages

### 4. Acceder a tu sitio

Una vez que el workflow termine, tu sitio estará disponible en:
```
https://tu-usuario.github.io/ergocalc/
```

## Deployment manual (alternativo)

Si prefieres hacer deploy manual:

```bash
# Opción 1: Usar el script
./deploy.sh

# Opción 2: Comandos individuales
npm run build
npm run deploy
```

## Configuración del repositorio

Asegúrate de que:
- El repositorio sea público (para GitHub Pages gratuito)
- O tengas GitHub Pro/Team (para repositorios privados)

## Personalización

Para cambiar la ruta base (si tu repo tiene otro nombre):
1. Edita `vite.config.js`
2. Cambia `/ergocalc/` por `/tu-nombre-de-repo/`

## Troubleshooting

### El sitio no carga
- Verifica que GitHub Pages esté habilitado
- Revisa que el workflow haya terminado exitosamente
- Espera unos minutos para la propagación

### Errores de rutas
- Asegúrate de que la `base` en `vite.config.js` coincida con tu nombre de repositorio
- Verifica que todas las rutas sean relativas

### Problemas de permisos
Si el workflow falla por permisos:
1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Guarda los cambios y ejecuta el workflow nuevamente
