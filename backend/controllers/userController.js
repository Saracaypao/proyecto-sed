const modeloUsuario = require('../models/userModel');

const registrarUsuario = async (req, res) => {
    try {
        // Leer el cuerpo de la solicitud
        let cuerpo = '';
        req.on('data', chunk => {
            cuerpo += chunk.toString();
        });

        req.on('end', async () => {
            const { nombre, correo, contrasena, confirmarContrasena } = JSON.parse(cuerpo);

            // Verificar que las contraseñas coincidan
            if (contrasena !== confirmarContrasena) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Las contraseñas no coinciden." }));
                return;
            }

            // Verificar si el usuario ya existe
            const usuarioExistente = await modeloUsuario.findOne({ correo });
            if (usuarioExistente) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "El correo ya está registrado." }));
                return;
            }

            // Crear un nuevo usuario
            const nuevoUsuario = new modeloUsuario({
                nombre,
                correo,
                contrasena 
            });

            await nuevoUsuario.save();

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: "Usuario registrado con éxito." }));
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

// Exportar la función correctamente
module.exports = { registrarUsuario };
