const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} RouteInfo
 * @property {string} route
 * @property {string} fullPath
 * @property {'page'|'layout'|'loading'|'error'|'not-found'} type
 */

/**
 * @param {string} dir
 * @param {RouteInfo[]} routes
 * @param {string} base
 * @returns {RouteInfo[]}
 */
function getAppRoutes(dir = path.join(process.cwd(), 'src/app'), routes = [], base = '') {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorar carpetas que empiezan con _ o .
      if (!file.startsWith('_') && !file.startsWith('.')) {
        getAppRoutes(filePath, routes, path.join(base, file));
      }
    } else {
      // Procesar archivos específicos del App Router
      const fileTypes = {
        'page.tsx': 'page',
        'page.ts': 'page',
        'layout.tsx': 'layout',
        'layout.ts': 'layout',
        'loading.tsx': 'loading',
        'error.tsx': 'error',
        'not-found.tsx': 'not-found'
      };

      const fileType = Object.entries(fileTypes).find(([key]) => file === key)?.[1];

      if (fileType) {
        const route = base.replace(/\\/g, '/');
        routes.push({
          route: route === '' ? '/' : `/${route}`,
          fullPath: filePath,
          type: fileType
        });
      }
    }
  });

  // Ordenar rutas para mejor legibilidad
  return routes.sort((a, b) => a.route.localeCompare(b.route));
}

function printAppRoutes() {
  try {
    const routes = getAppRoutes();

    console.log('\nRutas disponibles en tu aplicación Next.js (App Router):');
    console.log('================================================');
    
    if (routes.length === 0) {
      console.log('⚠️ No se encontraron rutas en src/app/');
      console.log('Asegúrate de que la ruta src/app/ existe y contiene archivos page.tsx');
      return;
    }

    routes.forEach(route => {
      const emoji = {
        page: '📄',
        layout: '🔲',
        loading: '⌛',
        error: '⚠️',
        'not-found': '🔍'
      }[route.type];

      console.log(`${emoji} ${route.type.toUpperCase()}: ${route.route}`);
      console.log(`   Ubicación: ${route.fullPath}`);
      console.log('------------------------------------------------');
    });
  } catch (error) {
    console.error('❌ Error al escanear las rutas:', error.message);
    console.log('\nPosibles soluciones:');
    console.log('1. Verifica que la carpeta src/app/ existe');
    console.log('2. Asegúrate de estar ejecutando el script desde la raíz del proyecto');
    console.log('3. Verifica los permisos de lectura de los directorios');
  }
}

// Ejecutar el script
printAppRoutes();