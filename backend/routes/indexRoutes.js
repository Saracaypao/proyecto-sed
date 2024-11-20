const http = require('http');
const userRoutes = require('./userRoutes');
const recipeRoutes = require('./recipeRoutes');
const categoryRoutes = require('./categoryRoutes')
const authRoutes = require('./authRoutes'); // Asegúrate de importar authRoutes

const apiRouter = (req, res) => {
    const parsedUrl = require('url').parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method;

    // Delegar las rutas de usuario
    if (pathname.startsWith('/api/user')) {
        userRoutes(req, res);
    }
    // Delegar las rutas de recetas
    else if (pathname.startsWith('/api/recipe')) {
        recipeRoutes(req, res);
    }
    else if (pathname.startsWith('/api/category')) {
        categoryRoutes(req, res);
    }
    // Delegar las rutas de autenticación (logIn y whoAmI)
    else if (pathname.startsWith('/logIn') || pathname.startsWith('/whoAmI')) {
        authRoutes(req, res); // Delegar a las rutas de autenticación
    }
    else if (pathname.startsWith('/') || pathname.startsWith('/')) {
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = apiRouter;
