const { createToken, verifyToken } = require('../utils/jwt.tools');
const userModel = require('../models/userModel');

const logIn = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { correo, contrasena } = JSON.parse(body);
            const user = await userModel.findOne({ correo });

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
                return;
            }

            if (!user.compareContrasena(contrasena)) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Contraseña incorrecta' }));
                return;
            }

            const token = await createToken(user._id, user.roles);

            user.tokens = [token, ...user.tokens.slice(0, 3)];
            await user.save();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token }));
        });
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ok: false,
            msg: 'Error interno del servidor',
            error: error.message || 'Error interno del servidor',
        }));
    }
};

const whoAmI = async (req, res) => {
    try {
        const { _id, nombre, correo, roles } = req.user;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ _id, nombre, correo, roles }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Error interno del servidor' }));
    }
};

module.exports = {
    logIn,
    whoAmI
};
