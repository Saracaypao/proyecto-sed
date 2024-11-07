const http = require('http');
const url = require('url');
const { registrarUsuario } = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');
const User = require('../models/userModel'); // Modelo de usuario

const userRoutes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/api/user/newUser' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            req.body = JSON.parse(body);
            validateUser(req, res, () => {
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
    }
    // Ruta para obtener todos los usuarios
    else if (parsedUrl.pathname === '/api/user/allUsers' && req.method === 'GET') {
        User.find()
            .then(users => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ users }));
            })
            .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al obtener los usuarios', details: error.message }));
            });
    }
    // Nueva ruta para eliminar un usuario
    else if (parsedUrl.pathname.startsWith('/api/user/deleteUser') && req.method === 'DELETE') {
        const userId = parsedUrl.query.id; // Obtiene el id del usuario desde la URL

        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Falta el ID del usuario' }));
            return;
        }

        User.findByIdAndDelete(userId)
            .then(result => {
                if (result) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Usuario eliminado con éxito' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
                }
            })
            .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al eliminar el usuario', details: error.message }));
            });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
};

module.exports = userRoutes;
