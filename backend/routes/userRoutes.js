const http = require('http');
const url = require('url');
const { registrarUsuario, obtenerTodosUsuarios, eliminarUsuario, editarUsuario  } = require('../controllers/userController'); // Importamos las funciones del controlador
const { authentication, authorization } = require('../middlewares/authMiddlewares');


const userRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Ruta para crear un nuevo usuario
    if (parsedUrl.pathname === '/api/user/newUser' && req.method === 'POST') {

        authentication(req, res, () => {  // Asegurarse de que el usuario esté autenticado
            authorization('super_admin')(req, res, () => {  // Verificar si el usuario es super_admin
                console.log("Auth passed")
                let body = '';
                req.on('data', chunk => {
                    body += chunk; // Recibe los datos en trozos
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    registrarUsuario(req, res); // Llamamos al controlador que maneja el registro del usuario
                });
            });
        });
    }
    // Ruta para obtener todos los usuarios
    else if (parsedUrl.pathname === '/api/user/allUsers' && req.method === 'GET') {
        obtenerTodosUsuarios(req, res); // Llamamos al controlador que maneja la obtención de usuarios
    }
    // Ruta para eliminar un usuario
    else if (parsedUrl.pathname.startsWith('/api/user/deleteUser') && req.method === 'DELETE') {
        authentication(req, res, () => {  // Asegurarse de que el usuario esté autenticado
            authorization('super_admin')(req, res, () => {  // Verificar si el usuario es super_admin
                eliminarUsuario(req, res); // Llamamos al controlador que maneja la eliminación del usuario
            });
        });
    }
    // Ruta para editar un usuario
    else if (parsedUrl.pathname.startsWith('/api/user/editUser') && req.method === 'PUT') {
        authentication(req, res, () => {  // Asegurarse de que el usuario esté autenticado
            authorization('super_admin')(req, res, () => {  // Verificar si el usuario es super_admin
                let body = '';
                req.on('data', chunk => {
                    body += chunk; // Recibe los datos en trozos
                });

                req.on('end', () => {
                    req.body = JSON.parse(body);
                    editarUsuario(req, res); // Llamamos al controlador que maneja la edición del usuario
                });
            });
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = userRoutes;
