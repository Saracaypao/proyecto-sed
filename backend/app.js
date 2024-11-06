require('dotenv').config();
const http = require('http');
const { dbConnection } = require('./services/db');
const apiRouter = require('./routes/indexRoutes');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    apiRouter(req, res);
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
