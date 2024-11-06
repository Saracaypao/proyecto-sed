const validators = {};

const contrasenaRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/;

validators.validateUser = (data) => {
    const errors = {};

    // Validar nombre
    if (!data.nombre || data.nombre.trim() === '') {
        errors.nombre = "Nombre es requerido.";
    } else if (data.nombre.length > 100) {
        errors.nombre = "La longitud máxima del nombre es de 100 caracteres.";
    }

    // Validar usuario
    if (!data.usuario || data.usuario.trim() === '') {
        errors.usuario = "Usuario es requerido.";
    } else if (data.usuario.length < 6 || data.usuario.length > 32) {
        errors.usuario = "Formato de usuario incorrecto.";
    }

    // Validar correo
    if (!data.correo || data.correo.trim() === '') {
        errors.correo = "Correo es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(data.correo)) {
        errors.correo = "Formato de correo incorrecto.";
    }

    // Validar contraseña
    if (!data.contrasena || data.contrasena.trim() === '') {
        errors.contrasena = "Contraseña es requerida.";
    } else if (!contrasenaRegexp.test(data.contrasena)) {
        errors.contrasena = "Formato de contraseña incorrecto.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validators;
