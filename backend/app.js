require('dotenv').config();
const http = require('http');
const cors = require('cors'); // Importar CORS
const { dbConnection } = require('./services/db');
const apiRouter = require('./routes/indexRoutes');

const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500']; // Asegúrate de que esta lista sea correcta

const server = http.createServer(async (req, res) => {
    // Habilitar CORS de forma centralizada
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204); // Responder a la preflight request
        return res.end();
    }

    apiRouter(req, res); // Delegar el manejo de rutas al apiRouter
});

dbConnection()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    });

module.exports = server;
