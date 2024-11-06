const http = require('http');
const url = require('url');
const { registrarUsuario } = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator'); // Validación de usuario
const User = require('../models/userModel'); // Modelo de usuario (suponiendo que tienes este modelo)

const userRoutes = (req, res) => {
    const parsedUrl = require('url').parse(req.url, true);

    if (parsedUrl.pathname === '/api/user/newUser' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            req.body = JSON.parse(body);
            validateUser(req, res, () => { // Validar datos antes de crear el usuario
                // Crear un nuevo usuario
                const newUser = new User(req.body);
                newUser.save()
                    .then(user => {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Usuario creado', user }));
                    })
                    .catch(error => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error al crear el usuario', details: error.message }));
                    });
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = userRoutes;
