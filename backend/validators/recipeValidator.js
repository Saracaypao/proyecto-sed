const validators = {};

validators.validateRecipe = (data) => {
    const errors = {};

    if (!data.nombreReceta || data.nombreReceta.trim() === '') {
        errors.nombreReceta = "El nombre de la receta es requerido.";
    }

    if (!data.ingredientes || !Array.isArray(data.ingredientes) || data.ingredientes.length === 0) {
        errors.ingredientes = "Se requieren al menos un ingrediente.";
    }

    if (!data.preparacion || data.preparacion.trim() === '') {
        errors.preparacion = "La preparación es requerida.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validators;
