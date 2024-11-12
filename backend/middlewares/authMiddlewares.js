const debug = require('debug')('app:auth-middleware');
const { verifyToken, secretKey } = require('../utils/jwt.tools');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const ROLES = require('../data/roles.js');

const middlewares = {};
const PREFIX = 'Bearer';

middlewares.authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            console.log("no auth")
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const [prefix, token] = authorization.split(' ');

        if (prefix !== PREFIX || !token) {
            console.log("no prefix")
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const payload = await verifyToken(token);
        console.log("payload", payload)
        if (!payload) {
            console.log("no payload")

            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)

        const userId = decoded.userId; 
        const user = await User.findById(userId);
        if (!user) {
            //BINGO!!!!!
            console.log("no user")

            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        const isTokenValid = user.tokens.includes(token);
        if (!isTokenValid) {
            console.log("no token valid")

            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no autenticado' }));
        }

        req.user = user;
        req.token = token;

        next(); // Continúa con el siguiente middleware o controlador
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message || 'Error interno del servidor' }));
    }
};


middlewares.authorization = (roleRequired = ROLES.SYSADMIN) => {
    return (req, res, next) => {
        try {
            const { roles = [] } = req.user;
            const isAuth = roles.includes(roleRequired);
            const isSysadmin = roles.includes(ROLES.SYSADMIN);

            if (!isAuth && !isSysadmin) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Prohibido' }));
            }

            console.log("returning...")
            next()
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: error.message || 'Error interno del servidor' }));
        }
    };
};

module.exports = middlewares;
