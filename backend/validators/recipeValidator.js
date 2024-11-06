const validators = {};

validators.validateRecipe = (data) => {
    const errors = {};

    // Validar título
    if (!data.titulo || data.titulo.trim() === '') {
        errors.titulo = "El título es requerido.";
    } else if (data.titulo.length > 100) {
        errors.titulo = "La longitud máxima del título es de 100 caracteres.";
    }

    // Validar ingredientes
    if (!data.ingredientes || !Array.isArray(data.ingredientes) || data.ingredientes.length === 0) {
        errors.ingredientes = "Se requieren al menos un ingrediente.";
    } else {
        data.ingredientes.forEach((ingrediente, index) => {
            if (typeof ingrediente !== 'string' || ingrediente.trim() === '') {
                errors[`ingredientes[${index}]`] = "Cada ingrediente debe ser una cadena no vacía.";
            }
        });
    }

    // Validar instrucciones
    if (!data.instrucciones || data.instrucciones.trim() === '') {
        errors.instrucciones = "Las instrucciones son requeridas.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validators;
