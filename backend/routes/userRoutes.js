const http = require('http');
const url = require('url');
const { registrarUsuario, obtenerTodosUsuarios, eliminarUsuario, editarUsuario, obtenerAdmins } = require('../controllers/userController');
const { authentication, authorization } = require('../middlewares/authMiddlewares');
const { getUserRole } = require('../controllers/authController');

const userRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/api/user/newUser' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk; 
        });

        req.on('end', () => {
            req.body = JSON.parse(body);

            if (req.body.rol === 'admin') {
                authentication(req, res, () => { 
                    authorization('super_admin')(req, res, () => {  
                        //console.log("Auth passed");
                        registrarUsuario(req, res);
                    });
                });
            } else {
                registrarUsuario(req, res);
            }
        });
    }

    else if (parsedUrl.pathname === '/api/user/allUsers' && req.method === 'GET') {
        obtenerTodosUsuarios(req, res); 
    }

    else if (parsedUrl.pathname.startsWith('/api/user/deleteUser') && req.method === 'DELETE') {
        authentication(req, res, () => { 
            const userId = parsedUrl.pathname.split('/').pop(); 
            req.userIdToDelete = userId; 
            authorization('super_admin')(req, res, () => {  
                eliminarUsuario(req, res); 
            });
        });
    }

    else if (parsedUrl.pathname.startsWith('/api/user/editUser') && req.method === 'PUT') {
        authentication(req, res, () => {  
            authorization('super_admin')(req, res, () => {  
                let body = '';
                req.on('data', chunk => {
                    body += chunk; 
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    editarUsuario(req, res);
                });
            });
        });
    }

    else if (parsedUrl.pathname === '/api/user/admins' && req.method === 'GET') {
        authentication(req, res, () => {  
            authorization('super_admin')(req, res, () => {  
                obtenerAdmins(req, res); 
            });
        });
    }
    //ruta para obtener roles
    else if (parsedUrl.pathname === '/api/user/roles' && req.method === 'GET') {
        authentication(req, res, () => {
            getUserRole(req, res);
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontradaaaaaa' }));
    }
};

module.exports = userRoutes;
