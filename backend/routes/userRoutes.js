const http = require('http');
const url = require('url');
const { registrarUsuario } = require('../controllers/userController');  // Asegúrate de que esta sea la función correcta
const runValidation = require('../validators/indexMiddleware');
const { createUserValidator } = require('../validators/userValidator');

// Define las rutas para los usuarios
const userRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method;

    // Ruta para crear un nuevo usuario
    if (method === 'POST' && pathname === '/newUser') {
        // Validación y controlador para crear usuario
        createUserValidator(req, res, () => {
            runValidation(req, res, () => {
                registrarUsuario(req, res);  // Llama a la función para registrar el usuario
            });
        });

    // Ruta para obtener todos los usuarios
    } else if (method === 'GET' && pathname === '/users') {
        registrarUsuario.findAll(req, res);  // Llama a la función para obtener todos los usuarios

    // Ruta para obtener un usuario por ID
    } else if (method === 'GET' && pathname.startsWith('/userById/')) {
        const userId = pathname.split('/')[2];  // Extrae el ID del usuario de la URL
        req.params = { id: userId };
        registrarUsuario.findOneById(req, res);  // Llama a la función para obtener el usuario por ID

    // Ruta para actualizar un usuario por ID
    } else if (method === 'PUT' && pathname.startsWith('/updateUser/')) {
        const userId = pathname.split('/')[2];
        req.params = { id: userId };
        registrarUsuario.update(req, res);  // Llama a la función para actualizar el usuario

    // Ruta no encontrada
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

// Exportar las rutas de usuario
module.exports = userRoutes;
