function validateUser(req, res, next) {
    const { nombre, correo, contrasena, confirmarContrasena } = req.body;

    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (contrasena !== confirmarContrasena) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com)$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ error: 'Correo no válido. Debe terminar en .com' });
    }

    const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;  
    if (!contrasenaRegex.test(contrasena)) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, una letra y un número' });
    }

    next();
}

module.exports = { validateUser };
