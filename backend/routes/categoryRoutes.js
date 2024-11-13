const http = require('http');
const url = require('url');
const { agregarCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoryController');
const { authentication, authorization } = require('../middlewares/authMiddlewares');

const categoryRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Ruta para agregar una nueva categoría
    if (parsedUrl.pathname === '/api/category/newCategory' && req.method === 'POST') {
        authentication(req, res, () => {  // Asegurarse de que el usuario esté autenticado
            authorization(['admin', 'super_admin'])(req, res, () => {  // Verificar si el usuario es admin o super_admin
                let body = '';
                req.on('data', chunk => {
                    body += chunk; // Recibe los datos en trozos
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    agregarCategoria(req, res); // Llamamos al controlador que maneja la creación de categorías
                });
            });
        });
    }
    // Ruta para editar una categoría
    else if (parsedUrl.pathname.startsWith('/api/category/editCategory') && req.method === 'PUT') {
        authentication(req, res, () => {  // Asegurarse de que el usuario esté autenticado
            authorization(['admin', 'super_admin'])(req, res, () => {  // Verificar si el usuario es admin o super_admin
                let body = '';
                req.on('data', chunk => {
                    body += chunk; // Recibe los datos en trozos
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    editarCategoria(req, res); // Llamamos al controlador que maneja la edición de categorías
                });
            });
        });
    }
    // Ruta para eliminar una categoría
    else if (parsedUrl.pathname.startsWith('/api/category/deleteCategory') && req.method === 'DELETE') {
        authentication(req, res, () => {  // Asegurarse de que el usuario esté autenticado
            authorization(['admin', 'super_admin'])(req, res, () => {  // Verificar si el usuario es admin o super_admin
                eliminarCategoria(req, res); // Llamamos al controlador que maneja la eliminación de categorías
            });
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = categoryRoutes;
