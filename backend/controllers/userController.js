const modeloUsuario = require('../models/userModel');

// Función para registrar un usuario
const registrarUsuario = async (req, res) => {
    const { nombre, correo, contrasena, confirmarContrasena, rol = 'user' } = req.body;
    const currentUser = req.user; // Usuario autenticado

    // Verificar que el usuario autenticado tenga el rol de 'super_admin' si intenta crear un 'admin'
    if (rol === 'admin' && (!currentUser || !currentUser.roles.includes('super_admin'))) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "No tienes permiso para crear un usuario administrador." }));
        return;
    }

    // Verificar que las contraseñas coincidan  
    if (contrasena !== confirmarContrasena) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Las contraseñas no coinciden." }));
        return;
    }

    try {
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
            contrasena,
            roles: [rol]  // Asignar el rol al nuevo usuario
        });

        await nuevoUsuario.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: "Usuario registrado con éxito." }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'Error interno del servidor', error: error.message || 'Error interno del servidor' }));
    }
};

// Función para aceptar una receta
const aceptarReceta = async (req, res) => {
    const recetaId = req.body.recetaId;
    const currentUser = req.user;

    if (!currentUser.roles.includes('super_admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo super_admin puede aceptar recetas." }));
        return;
    }

    try {
        const receta = await Receta.findByIdAndUpdate(recetaId, { estado: 'aprobada' });
        if (receta) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: "Receta aceptada con éxito." }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Receta no encontrada." }));
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Error al aceptar la receta", details: error.message }));
    }
};

// Función para rechazar una receta
const rechazarReceta = async (req, res) => {
    const recetaId = req.body.recetaId;
    const currentUser = req.user;

    if (!currentUser.roles.includes('super_admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo super_admin puede rechazar recetas." }));
        return;
    }

    try {
        const receta = await Receta.findByIdAndUpdate(recetaId, { estado: 'rechazada' });
        if (receta) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: "Receta rechazada con éxito." }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Receta no encontrada." }));
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Error al rechazar la receta", details: error.message }));
    }
};

// Función para obtener todos los usuarios
const obtenerTodosUsuarios = async (req, res) => {
    try {
        const usuarios = await modeloUsuario.find(); // Obtén todos los usuarios de la base de datos
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ usuarios }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'Error al obtener usuarios', error: error.message }));
    }
};

// Función para eliminar un usuario
const eliminarUsuario = async (req, res) => {
    const userId = req.url.split('/').pop(); // Obtener el ID del usuario desde la URL

    try {
        const resultado = await modeloUsuario.findByIdAndDelete(userId);
        if (resultado) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Usuario eliminado con éxito' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al eliminar el usuario', details: error.message }));
    }
};

module.exports = { registrarUsuario, obtenerTodosUsuarios, eliminarUsuario, aceptarReceta, rechazarReceta };
