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
    descripcion : {
        type: String,
        required: true,
        trim: true,
    },
    porciones : {
        type: String,
        required: true,
        trim: true,
    },
    autor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", 
        required: true,
    },
    categoria: {
        type: String,   
        enum: ['Entradas', 'Platos principales', 'Complementos', 'Bebidas', 'Postres'],
        required: true,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada'],
        default: 'pendiente',
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

// Middleware para actualizar la fecha de actualización
recetaSchema.pre('save', function (next) {
    this.actualizadoEn = Date.now();
    next();
});

module.exports = mongoose.model('Receta', recetaSchema);
