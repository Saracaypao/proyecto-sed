const url = require('url');
const { validateRecipe } = require('../validators/recipeValidator');
const recipeController = require('../controllers/recipeController');
const middlewares = require('../middlewares/authMiddlewares');

const recipeRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Ruta para agregar una receta
    if (method === 'POST' && path === '/api/recipe/newRecetas') {
        recipeController.agregarReceta(req, res);
    }
    // Ruta para obtener todas las recetas
    else if (method === 'GET' && path === '/api/recipe/allRecetas') {
        recipeController.obtenerTodasRecetas(req, res);
    }
    // Ruta para buscar recetas por filtros
    else if (method === 'GET' && path === '/api/recipe/search') {
        req.query = parsedUrl.query;
        recipeController.buscarRecetasPorFiltro(req, res);
    }
    // Ruta para actualizar una receta específica
    else if (method === 'PUT' && path.startsWith('/api/recipe/update/')) {
        const recetaId = path.split('/')[4];
        req.params = { id: recetaId };
        recipeController.actualizarReceta(req, res);
    }
    // Ruta para eliminar una receta específica
    else if (method === 'DELETE' && path.startsWith('/api/recipe/delete/')) {
        const recetaId = path.split('/')[4];
        req.params = { id: recetaId };
        recipeController.eliminarReceta(req, res);
    }
    else if (method === 'POST' && path === '/api/recipe/aceptarReceta') {
        middlewares.parseJSONBody(req, res, () => {  // Asegúrate de usar el middleware aquí
            middlewares.authentication(req, res, () => {
                middlewares.authorization('super_admin')(req, res, () => {
                    recipeController.aceptarReceta(req, res);  // Cambié rechazarReceta por aceptarReceta
                });
            });
        });
    }    
    // Ruta para rechazar una receta (solo super_admin)
    else if (method === 'POST' && path === '/api/recipe/rechazarReceta') {
        middlewares.parseJSONBody(req, res, () => {  // Asegúrate de usar este middleware
            middlewares.authentication(req, res, () => {
                middlewares.authorization('super_admin')(req, res, () => {
                    recipeController.rechazarReceta(req, res);
                });
            });
        });
    }    
    // Ruta no encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Ruta no encontrada' }));
    }
};

module.exports = recipeRoutes;