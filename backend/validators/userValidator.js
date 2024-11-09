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

    // Validar el formato del correo (solo @ y .com al final)
    const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com)$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ error: 'Correo no válido. Debe terminar en .com' });
    }

    // Validar contraseñas seguras
    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;  // Al menos 8 caracteres, una letra y un número
    if (!contrasenaRegex.test(contrasena)) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, una letra y un número' });
    }

    // Si todo está bien, continuar con la ejecución
    next();
}

module.exports = { validateUser };
