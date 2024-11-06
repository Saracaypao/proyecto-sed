const url = require('url');
const userRoutes = require("./userRoutes");
const recipeRoutes = require("./recipeRoutes");
const authRoutes = require("./authRoutes");

// Función que maneja las rutas de la API
const apiRouter = (req, res) => {
    const parsedUrl = require('url').parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method;

    // Delegar las rutas de usuario
    if (pathname.startsWith('/api/user')) {
        userRoutes(req, res); // Delegar a las rutas de usuario
    }
    // Delegar las rutas de recetas (si existe)
    else if (pathname.startsWith('/api/recipe')) {
        recipeRoutes(req, res); // Delegar a las rutas de recetas
    }
    // Ruta no encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = apiRouter;
