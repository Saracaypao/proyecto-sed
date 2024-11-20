require('dotenv').config();
const http = require('http');
const { dbConnection } = require('./services/db');
const apiRouter = require('./routes/indexRoutes');

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'http://127.0.0.1:80',
    'http://localhost:80',
    'http://192.168.29.130:80',
    'http://192.168.29.130:443'
];

const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    apiRouter(req, res);
});

dbConnection()
    .then(() => {
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    });

module.exports = server;
