# ErgoCalc - Finger Tracking Canvas

Una aplicación web para análisis ergonómico usando seguimiento de dedos en un canvas táctil. Construida con Vite + React para máxima compatibilidad y desplegada en GitHub Pages.

## 🎯 Características

- **Seguimiento multi-dedo**: Rastrea hasta 5 dedos con colores diferentes
- **Zonas de pintura**: Define áreas restringidas donde los toques de dedos son ignorados
- **Análisis de regresión**: Cálculo automático de líneas de dirección principal y cuadrados centroides
- **Soporte táctil y mouse**: Funciona tanto en escritorio como en dispositivos móviles
- **Visualización en tiempo real**: Ve puntos, líneas y análisis en tiempo real

## 🚀 Demo en Vivo

Visita la aplicación en vivo: [https://tu-usuario.github.io/ergocalc/](https://tu-usuario.github.io/ergocalc/)

## 🛠️ Desarrollo Local

### Prerrequisitos
- Node.js 18 o superior
- npm

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/ergocalc.git
cd ergocalc
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador y navega a `http://localhost:5173`

### Construcción para Producción

```bash
npm run build
```

Los archivos construidos estarán en el directorio `dist`.

## 📦 Despliegue en GitHub Pages

### Configuración Automática
1. Haz push a la rama `main`
2. GitHub Actions desplegará automáticamente el sitio

### Configuración Manual
Para configurar GitHub Pages manualmente, consulta: [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)

### Deploy Manual
```bash
npm run deploy
# o usa el script
./deploy.sh
```

## 📱 Uso

1. **Selecciona un dedo**: Elige qué dedo quieres rastrear desde el menú superior
2. **Modo tocar/clic**: 
   - Haz clic o toca el canvas para colocar puntos para el dedo seleccionado
   - Cada dedo tiene un color único
   - Las líneas de regresión y cuadrados centroides se calculan automáticamente
3. **Modo pintura**: 
   - Activa el modo pintura para definir zonas restringidas
   - Dibuja áreas donde los toques de dedos deben ser ignorados
4. **Funciones de limpieza**:
   - "Limpiar Zonas": Elimina todas las zonas pintadas
   - "Limpiar Todo": Reinicia todo el canvas

## 🏗️ Detalles Técnicos

- **Framework**: React 18 (con Vite para desarrollo rápido)
- **Herramienta de construcción**: Vite
- **Estilos**: CSS vanilla con diseño responsivo
- **Canvas**: API Canvas HTML5 para dibujo
- **Matemáticas**: Análisis de Componentes Principales para líneas de regresión

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── TabletCanvas.jsx    # Componente principal del canvas
│   └── icons.jsx           # Componentes de iconos SVG
├── app.jsx                 # Componente principal de la app
├── main.jsx               # Punto de entrada de la app
└── index.css              # Estilos globales
```

## 🌐 Soporte de Navegadores

- Navegadores modernos con soporte ES6+
- Navegadores móviles con soporte de eventos táctiles
- Se requiere soporte de Canvas 2D API

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de la construcción de producción
- `npm run deploy` - Despliega a GitHub Pages
- `./deploy.sh` - Script de despliegue completo

## 📄 Licencia

ISC License
