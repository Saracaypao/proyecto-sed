require('dotenv').config(); // Cargar las variables de entorno
const http = require('http');
const url = require('url');
const { dbConnection } = require('./services/db'); // Función para conectar a la base de datos
const apiRouter = require('./routes/indexRoutes'); // Router para manejar las rutas de la API

// Configurar el puerto desde la variable de entorno, o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

// Configurar las opciones de CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
    // CORS: Verificar el origen y agregar encabezados
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Manejar el método OPTIONS (requerido para CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // Rutas API
    const parsedUrl = url.parse(req.url, true);

    // Verificar si la URL empieza con "/api" y usar el router adecuado
    if (parsedUrl.pathname.startsWith('/api')) {
        apiRouter(req, res);
    } else {
        // Ruta no encontrada
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});

// Conectar a la base de datos antes de iniciar el servidor
dbConnection()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`API escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Finaliza la aplicación si hay un error de conexión
    });

module.exports = server; // Exportar el servidor si se necesita para pruebas o configuraciones adicionales
