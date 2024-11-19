const { logIn, whoAmI } = require('../controllers/authController'); // Importar controladores
const { authentication } = require('../middlewares/authMiddlewares'); // Middleware de autenticación
const http = require('http');

const authRoutes = (req, res) => {
    const { url, method } = req;

    // Ruta para login (POST)
    if (method === 'POST' && url === '/logIn') {
        logIn(req, res); // Llama a la función logIn del controlador
    }
    // Ruta para obtener información del usuario (GET)
    else if (method === 'GET' && url === '/whoAmI') {
        authentication(req, res, () => whoAmI(req, res)); // Autenticación y luego respuesta
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = authRoutes;
