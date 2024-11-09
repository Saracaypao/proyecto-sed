const http = require('http');
const url = require('url');
const { registrarUsuario, obtenerTodosUsuarios, eliminarUsuario } = require('../controllers/userController'); // Importamos las funciones del controlador

const userRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Ruta para crear un nuevo usuario
    if (parsedUrl.pathname === '/api/user/newUser' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk; // Recibe los datos en trozos
        });

        req.on('end', () => {
            req.body = JSON.parse(body);
            registrarUsuario(req, res); // Llamamos al controlador que maneja el registro del usuario
        });
    }
    // Ruta para obtener todos los usuarios
    else if (parsedUrl.pathname === '/api/user/allUsers' && req.method === 'GET') {
        obtenerTodosUsuarios(req, res); // Llamamos al controlador que maneja la obtención de usuarios
    }
    // Ruta para eliminar un usuario
    else if (parsedUrl.pathname.startsWith('/api/user/deleteUser') && req.method === 'DELETE') {
        eliminarUsuario(req, res); // Llamamos al controlador que maneja la eliminación del usuario
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = userRoutes;
