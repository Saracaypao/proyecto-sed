const mongoose = require('mongoose');
const modeloUsuario = require('../models/userModel');


const registrarUsuario = async (req, res) => {
    const { nombre, correo, contrasena, confirmarContrasena, rol = 'user' } = req.body;
    const currentUser = req.user; 


    if (rol === 'admin' && (!currentUser || !currentUser.roles.includes('super_admin'))) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "No tienes permiso para crear un usuario administrador." }));
        return;
    }


    if (contrasena !== confirmarContrasena) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Las contraseñas no coinciden." }));
        return;
    }

    try {

        const usuarioExistente = await modeloUsuario.findOne({ correo });
        if (usuarioExistente) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "El correo ya está registrado." }));
            return;
        }


        const nuevoUsuario = new modeloUsuario({
            nombre,
            correo,
            contrasena,
            roles: [rol]  
        });

        await nuevoUsuario.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        /*res.end(JSON.stringify({ mensaje: "Usuario registrado con éxito." }));*/
        res.end(JSON.stringify({
            mensaje: "Usuario registrado con éxito.",
            usuario: nuevoUsuario 
        }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'Error interno del servidor', error: error.message || 'Error interno del servidor' }));
    }
};

const editarUsuario = async (req, res) => {
    const userId = req.url.split('/').pop(); 
    const { nombre, correo, rol } = req.body;
    const currentUser = req.user;

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

        if (currentUser.roles.includes('super_admin') && rol && rol !== usuario.roles[0]) {
            if (rol === 'super_admin') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "No se puede cambiar el rol a super_admin." }));
                return;
            }
        }

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


const obtenerTodosUsuarios = async (req, res) => {
    try {
        const usuarios = await modeloUsuario.find(); 
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ usuarios }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, msg: 'Error al obtener usuarios', error: error.message }));
    }
};


const eliminarUsuario = async (req, res) => {
    //const userId = req.url.split('/').pop(); 
    const userId = req.userIdToDelete; 
    const currentUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "ID de usuario no válido." }));
        return;
    }

    if (currentUser._id !== userId && !currentUser.roles.includes('super_admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: no puedes eliminar otro usuario." }));
        return;
    }

    try {
        const usuario = await modeloUsuario.findById(userId);
        if (!usuario) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Usuario no encontrado." }));
            return;
        }
        if (usuario.roles.includes('super_admin') && currentUser._id !== userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "No puedes eliminar a un super_admin." }));
            return;
        }

        await modeloUsuario.findByIdAndDelete(userId);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Usuario eliminado con éxito' }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al eliminar el usuario', details: error.message }));
    }
};

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
