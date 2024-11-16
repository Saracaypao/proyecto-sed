const debug = require('debug')('app:auth-middleware');
const { verifyToken, secretKey } = require('../utils/jwt.tools');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ROLES = require('../data/roles.js');

const middlewares = {};
const PREFIX = 'Bearer';

// middleware para procesar el json en el body de la solicitud
middlewares.parseJSONBody = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            req.body = JSON.parse(body);
            next();
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Error en el formato JSON', error: error.message }));
        }
    });
};

middlewares.authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const [prefix, token] = authorization.split(' ');

        if (prefix !== PREFIX || !token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const payload = await verifyToken(token);
        if (!payload) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const decoded = jwt.verify(token, secretKey);

        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const isTokenValid = user.tokens.includes(token);
        if (!isTokenValid) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        req.user = user;
        req.token = token;

        // quitar este console.log luego
        console.log('Token:', token);
        console.log('Decoded Payload:', payload);

        next(); 
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message || 'Error interno del servidor' }));
    }
};

middlewares.authorization = (requiredRoles = [ROLES.SYSADMIN]) => {
    return (req, res, next) => {
        try {
            // asegura que requiredRoles sea siempre un array
            if (!Array.isArray(requiredRoles)) {
                requiredRoles = [requiredRoles];
            }

            const { roles = [] } = req.user;
            const hasPermission = requiredRoles.some(role => roles.includes(role));

            if (!hasPermission) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Prohibido' }));
            }

            next();
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: error.message || 'Error interno del servidor' }));
        }
    };
};


module.exports = middlewares;
