const http = require('http');
const authController = require('../controllers/authController');
const { authentication } = require('../middlewares/authMiddlewares');

const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    // Rutas de Autenticación
    if (method === 'POST' && url === '/logIn') {
        await authController.logIn(req, res);
    } else if (method === 'GET' && url === '/whoAmI') {
        await authentication(req, res, () => authController.whoAmI(req, res));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});

// Exporta el servidor directamente
module.exports = server;
