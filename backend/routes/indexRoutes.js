const userRoutes = require("./userRoutes");
const recipeRoutes = require("./recipeRoutes");
const authRoutes = require("./authRoutes");

const router = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    // Delegar a las rutas de usuario
    if (pathname.startsWith('/user')) {
        userRoutes(req, res);
    }
    // Delegar a las rutas de recetas
    else if (pathname.startsWith('/recipe')) {
        recipeRoutes(req, res);
    }
    // Delegar a las rutas de autenticación
    else if (pathname.startsWith('/auth')) {
        authRoutes(req, res);
    }
    // Ruta no encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Ruta no encontrada' }));
    }
};

module.exports = router;
