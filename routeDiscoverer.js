const http = require('http');

const PORT = 3000; // o el puerto que estés usando

function discoverRoutes() {
  // Hacer una petición OPTIONS al servidor para obtener las rutas
  const options = {
    hostname: 'localhost',
    port: PORT,
    method: 'OPTIONS',
    path: '/',
  };

  const req = http.request(options, (res) => {
    console.log('\nRutas disponibles en localhost:' + PORT);
    console.log('=====================================');

    if (res.statusCode === 404) {
      console.log('❌ Asegúrate de que el servidor está corriendo (npm run dev)');
      return;
    }

    // Imprimir las rutas encontradas
    const allowedMethods = res.headers['allow'];
    if (allowedMethods) {
      console.log('Métodos permitidos:', allowedMethods);
    }

    // Hacer una petición GET para obtener más información
    http.get(`http://localhost:${PORT}/_next/routes`, (routesRes) => {
      let data = '';
      
      routesRes.on('data', (chunk) => {
        data += chunk;
      });

      routesRes.on('end', () => {
        try {
          // Intentar parsear la respuesta si es JSON
          const routes = JSON.parse(data);
          console.log('\nRutas encontradas:');
          routes.forEach(route => {
            console.log(`📄 ${route}`);
          });
        } catch (e) {
          // Si no es JSON, probablemente sea HTML
          const routes = data.match(/href="([^"]+)"/g);
          if (routes) {
            console.log('\nRutas encontradas:');
            routes.forEach(route => {
              const cleanRoute = route.replace('href="', '').replace('"', '');
              if (cleanRoute.startsWith('/') && !cleanRoute.includes('_next')) {
                console.log(`📄 ${cleanRoute}`);
              }
            });
          }
        }
      });
    }).on('error', (err) => {
      console.error('Error al obtener las rutas:', err.message);
    });
  });

  req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ No se pudo conectar al servidor.');
      console.log('\nAsegúrate de:');
      console.log('1. Que el servidor está corriendo (npm run dev)');
      console.log(`2. Que el puerto ${PORT} es el correcto`);
      console.log('3. Que no hay otro servicio usando ese puerto');
    } else {
      console.error('Error:', error.message);
    }
  });

  req.end();
}

// Ejecutar el descubrimiento
discoverRoutes();