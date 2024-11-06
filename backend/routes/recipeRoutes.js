const http = require('http');
const url = require('url');
const recipeController = require('../controllers/recipeController');
const { validateRecipe } = require('../validators/recipeValidator');

// Crear el servidor HTTP
const recipeRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Ruta para agregar una receta
    if (method === 'POST' && path === '/recetas') {
        validateRecipe(req, res, () => recipeController.agregarReceta(req, res));
    
    // Ruta para obtener todas las recetas
    } else if (method === 'GET' && path === '/recetas') {
        recipeController.obtenerRecetas(req, res);

    // Ruta para buscar recetas con filtros
    } else if (method === 'GET' && path === '/recetas/buscar') {
        recipeController.buscarRecetas(req, res, parsedUrl.query);

    // Ruta para actualizar una receta específica
    } else if (method === 'PUT' && path.startsWith('/recetas/actualizar/')) {
        const recetaId = path.split('/')[3];  // Extraer el ID de la receta de la URL
        recipeController.editarReceta(req, res, recetaId);

    // Ruta para eliminar una receta específica
    } else if (method === 'DELETE' && path.startsWith('/recetas/eliminar/')) {
        const recetaId = path.split('/')[3];  // Extraer el ID de la receta de la URL
        recipeController.eliminarReceta(req, res, recetaId);

    // Ruta no encontrada
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Ruta no encontrada' }));
    }
};

// Exportar las rutas
module.exports = recipeRoutes;
