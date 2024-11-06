const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recetaSchema = new Schema({
    nombreReceta: {
        type: String,
        required: true,
        trim: true,
    },
    ingredientes: {
        type: [String], // Array de ingredientes
        required: true,
    },
    preparacion: {
        type: String,
        required: true,
        trim: true,
    },
    imagen: {
        type: String, // URL de la imagen
        required: false,
    },
    creador: {
        type: Schema.Types.ObjectId, // Referencia al modelo de usuario
        required: true,
        ref: 'User', // Nombre del modelo de usuario
    },
    creadoEn: {
        type: Date,
        default: Date.now,
    },
    actualizadoEn: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para actualizar la fecha de actualización al guardar
recetaSchema.pre('save', function (next) {
    this.actualizadoEn = Date.now();
    next();
});

module.exports = mongoose.model('Receta', recetaSchema);
