const http = require('http');
const url = require('url');
const { validateRecipe } = require('../validators/recipeValidator');
const recipeController = require('../controllers/recipeController');

// Crear el servidor HTTP
const recipeRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Ruta para agregar una receta
    if (method === 'POST' && path === '/api/recipe/newRecetas') {
        recipeController.agregarReceta(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Ruta no encontrada' }));
    }
};

module.exports = recipeRoutes;