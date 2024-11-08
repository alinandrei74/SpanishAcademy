import fs from 'fs'
import path from 'path'

interface RouteInfo {
  path: string;
  fileName: string;
  fullPath: string;
}

function getRoutes(dir: string, routes: RouteInfo[] = [], base = ''): RouteInfo[] {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Recursivamente buscar en subdirectorios
      getRoutes(filePath, routes, path.join(base, file))
    } else {
      // Procesar solo archivos TypeScript/JavaScript
      if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        // Ignorar archivos que empiezan con _ o .
        if (!file.startsWith('_') && !file.startsWith('.')) {
          const route = path.join(base, file)
            .replace(/\.(ts|tsx|js|jsx)$/, '') // Remover extensión
            .replace(/\/index$/, '') // Remover index
            .replace(/\\/g, '/') // Normalizar separadores de ruta

          routes.push({
            path: route === '' ? '/' : `/${route}`,
            fileName: file,
            fullPath: filePath
          })
        }
      }
    }
  })

  return routes
}

// Función para imprimir las rutas encontradas
function printRoutes() {
  const pagesDir = path.join(process.cwd(), 'pages')
  const routes = getRoutes(pagesDir)

  console.log('\nRutas disponibles en tu aplicación:')
  console.log('==================================')
  
  routes.forEach(route => {
    console.log(`📄 Ruta: ${route.path}`)
    console.log(`   Archivo: ${route.fileName}`)
    console.log(`   Ubicación: ${route.fullPath}`)
    console.log('----------------------------------')
  })
}

// Ejecutar el script
printRoutes()