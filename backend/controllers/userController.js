const mongoose = require('mongoose');
const modeloUsuario = require('../models/userModel');

// función para registrar un usuario
const registrarUsuario = async (req, res) => {
    const { nombre, correo, contrasena, confirmarContrasena, rol = 'user' } = req.body;
    const currentUser = req.user; // Usuario autenticado

    // verificar que el usuario autenticado tenga el rol de 'super_admin' si intenta crear un 'admin'
    if (rol === 'admin' && (!currentUser || !currentUser.roles.includes('super_admin'))) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "No tienes permiso para crear un usuario administrador." }));
        return;
    }

    // verificar que las contraseñas coincidan  
    if (contrasena !== confirmarContrasena) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Las contraseñas no coinciden." }));
        return;
    }

    try {
        // verificar si el usuario ya existe
        const usuarioExistente = await modeloUsuario.findOne({ correo });
        if (usuarioExistente) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "El correo ya está registrado." }));
            return;
        }

        // crear un nuevo usuario
        const nuevoUsuario = new modeloUsuario({
            nombre,
            correo,
            contrasena,
            roles: [rol]  // asigna el rol al nuevo usuario
        });

        await nuevoUsuario.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        /*res.end(JSON.stringify({ mensaje: "Usuario registrado con éxito." }));*/
        res.end(JSON.stringify({
            mensaje: "Usuario registrado con éxito.",
            usuario: nuevoUsuario // Incluir el usuario creado
        }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'Error interno del servidor', error: error.message || 'Error interno del servidor' }));
    }
};

const editarUsuario = async (req, res) => {
    const userId = req.url.split('/').pop(); // obtener el id del usuario desde la url
    const { nombre, correo, rol } = req.body;
    const currentUser = req.user;

    // Verificar que el usuario autenticado intente editar su propio perfil o que sea super_admin
    if (currentUser._id !== userId && (!currentUser.roles.includes('super_admin'))) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: no puedes editar otro usuario." }));
        return;
    }

    try {
        const usuario = await modeloUsuario.findById(userId);
        
        if (!usuario) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Usuario no encontrado." }));
            return;
        }

        // si el usuario autenticado es super_admin, puede editar cualquier usuario (incluyendo el rol de admin)
        if (currentUser.roles.includes('super_admin') && rol && rol !== usuario.roles[0]) {
            // Asegurarse de que el super_admin no cambie el rol de un super_admin a otro rol
            if (rol === 'super_admin') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "No se puede cambiar el rol a super_admin." }));
                return;
            }
        }

        // actualizar el usuario con la nueva información
        usuario.nombre = nombre || usuario.nombre;
        usuario.correo = correo || usuario.correo;
        usuario.roles = [rol || usuario.roles[0]]; // solo se puede cambiar el rol si el super_admin lo permite

        await usuario.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: "Usuario editado con éxito.", usuario }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al editar el usuario', details: error.message }));
    }
};

// función para obtener todos los usuarios
const obtenerTodosUsuarios = async (req, res) => {
    try {
        const usuarios = await modeloUsuario.find(); // obtén todos los usuarios de la base de datos
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ usuarios }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'Error al obtener usuarios', error: error.message }));
    }
};

// función para eliminar un usuario
const eliminarUsuario = async (req, res) => {
    //const userId = req.url.split('/').pop(); // obtener el id del usuario desde la url
    const userId = req.userIdToDelete; // Ahora usamos el ID adjuntado en la ruta
    const currentUser = req.user;

    // Verificar si el userId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "ID de usuario no válido." }));
        return;
    }

    // Verificar que el usuario autenticado intente eliminar su propio perfil o que sea super_admin
    if (currentUser._id !== userId && !currentUser.roles.includes('super_admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: no puedes eliminar otro usuario." }));
        return;
    }

    try {
        // Verificar si el usuario a eliminar existe
        const usuario = await modeloUsuario.findById(userId);
        if (!usuario) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Usuario no encontrado." }));
            return;
        }

        // Verificar que no se intente eliminar a un super_admin
        if (usuario.roles.includes('super_admin') && currentUser._id !== userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "No puedes eliminar a un super_admin." }));
            return;
        }

        // Eliminar el usuario
        await modeloUsuario.findByIdAndDelete(userId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Usuario eliminado con éxito' }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al eliminar el usuario', details: error.message }));
    }
};

// Función para obtener solo los administradores
const obtenerAdmins = async (req, res) => {
    const currentUser = req.user;

    if (!currentUser.roles.includes('super_admin')) {
        return res.writeHead(403, { 'Content-Type': 'application/json' })
                   .end(JSON.stringify({ error: "Permiso denegado: solo los super_admin pueden obtener administradores." }));
    }

    try {
        const admins = await modeloUsuario.find({ roles: 'admin' });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ admins }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al obtener los administradores', details: error.message }));
    }
};


module.exports = { registrarUsuario, obtenerTodosUsuarios, eliminarUsuario, editarUsuario, obtenerAdmins };
