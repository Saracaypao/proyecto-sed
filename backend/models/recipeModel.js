const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recetaSchema = new Schema({
    nombreReceta: {
        type: String,
        required: true,
        trim: true,
    },
    ingredientes: {
        type: [String],
        required: true,
    },
    preparacion: {
        type: String,
        required: true,
        trim: true,
    },
    imagen: {
        type: String,
        required: false,
    },
    categoria: {
        type: String,
        enum: ['entradas', 'platos fuertes', 'complementos', 'bebidas', 'postres'],
        required: true,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada'],
        default: 'pendiente',
    },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    creadoEn: {
        type: Date,
        default: Date.now,
    },
    actualizadoEn: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para actualizar la fecha de actualización
recetaSchema.pre('save', function (next) {
    this.actualizadoEn = Date.now();
    next();
});

module.exports = mongoose.model('Receta', recetaSchema);
