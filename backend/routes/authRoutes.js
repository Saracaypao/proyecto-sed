const { logIn, whoAmI } = require('../controllers/authController'); 
const { authentication } = require('../middlewares/authMiddlewares'); 
const http = require('http');

const authRoutes = (req, res) => {
    const { url, method } = req;

    if (method === 'POST' && url === '/logIn') {
        logIn(req, res); 
    }

    else if (method === 'GET' && url === '/whoAmI') {
        authentication(req, res, () => whoAmI(req, res)); 
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = authRoutes;
