const http = require('http');
const url = require('url');
const { agregarCategoria, editarCategoria, eliminarCategoria } = require('../controllers/categoryController');
const { authentication, authorization } = require('../middlewares/authMiddlewares');

const categoryRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);


    if (parsedUrl.pathname === '/api/category/newCategory' && req.method === 'POST') {
        authentication(req, res, () => { 
            authorization(['admin', 'super_admin'])(req, res, () => {  
                let body = '';
                req.on('data', chunk => {
                    body += chunk; 
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    agregarCategoria(req, res); 
                });
            });
        });
    }

    else if (parsedUrl.pathname.startsWith('/api/category/editCategory') && req.method === 'PUT') {
        authentication(req, res, () => { 
            authorization(['admin', 'super_admin'])(req, res, () => {  
                let body = '';
                req.on('data', chunk => {
                    body += chunk; 
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    editarCategoria(req, res); 
                });
            });
        });
    }

    else if (parsedUrl.pathname.startsWith('/api/category/deleteCategory') && req.method === 'DELETE') {
        authentication(req, res, () => { 
            authorization(['admin', 'super_admin'])(req, res, () => {  
                eliminarCategoria(req, res); 
            });
        });
    }

    else if (parsedUrl.pathname === '/api/category/allCategories' && req.method === 'GET') {
        obtenerTodasCategorias(req, res);
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = categoryRoutes;
