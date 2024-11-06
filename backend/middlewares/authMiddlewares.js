const debug = require('debug')('app:auth-middleware');
const { verifyToken } = require('../utils/jwt.tools');
const User = require('../models/userModel');

const ROLES = require('../data/roles.js');

const middlewares = {};
const PREFIX = 'Bearer';

middlewares.authentication = async (req, res) => {
    try {
        debug('User authentication');

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

        const userId = payload.userId; 

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

        console.log('Token:', token);
        console.log('Decoded Payload:', payload);
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: error.message || 'Error interno del servidor' }));
    }
};

middlewares.authorization = (roleRequired = ROLES.SYSADMIN) => {
    return (req, res) => {
        try {
            const { roles = [] } = req.user;

            const isAuth = roles.includes(roleRequired);
            const isSysadmin = roles.includes(ROLES.SYSADMIN);

            if (!isAuth && !isSysadmin) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Prohibido' }));
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: error.message || 'Error interno del servidor' }));
        }
    };
};

module.exports = middlewares;
