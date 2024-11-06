// Función para validar los datos de un usuario
function validateUser(req, res, next) {
    const { nombre, correo, contrasena, confirmarContrasena } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Validar el formato del correo
    const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ error: 'Correo no válido' });
    }

    // Si todo está bien, continuar con la ejecución
    next();
}

// Exportar la función para usarla en otras partes de la aplicación
module.exports = { validateUser };