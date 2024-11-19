const { verifyToken } = require('../utils/jwt.tools');
const Receta = require('../models/recipeModel');
const Usuario = require('../models/userModel'); // Importa el modelo de usuario
const mongoose = require('mongoose');

const controller = {};

// Función para agregar una receta
controller.agregarReceta = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'No autorizado, token no encontrado' }));
        }

        const decoded = await verifyToken(token);
        if (!decoded || !decoded.userId) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'No autorizado, autor no encontrado' }));
        }

        const usuario = await Usuario.findById(decoded.userId);
        if (!usuario) {
            return res.writeHead(404, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'Usuario no encontrado' }));
        }

        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', async () => {
            try {
                const { nombreReceta, ingredientes, preparacion, descripcion, porciones, categoria } = JSON.parse(body);
                if (!nombreReceta || !ingredientes || !preparacion || !descripcion || !porciones || !categoria) {
                    return res.writeHead(400, { 'Content-Type': 'application/json' })
                              .end(JSON.stringify({ mensaje: 'Faltan campos requeridos' }));
                }

                const nuevaReceta = new Receta({
                    autor: usuario._id,
                    nombreReceta,
                    ingredientes,
                    preparacion,
                    descripcion,
                    porciones,
                    categoria,
                });

                await nuevaReceta.save();
                res.writeHead(201, { 'Content-Type': 'application/json' })
                   .end(JSON.stringify({ mensaje: 'Receta agregada exitosamente' }));
            } catch (parseError) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                   .end(JSON.stringify({ mensaje: 'Error en el formato JSON', error: parseError.message }));
            }
        });
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ mensaje: 'Error interno del servidor', error: error.message }));
    }
};

// Función para aceptar una receta
controller.aceptarReceta = async (req, res) => {
    try {
        const { recipeId } = req.body;

        if (!recipeId) {
            return res.writeHead(400, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ error: 'Se requiere el ID de la receta' }));
        }

        const recipe = await Receta.findById(recipeId);
        if (!recipe) {
            return res.writeHead(404, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ error: 'Receta no encontrada' }));
        }

        // Cambiar el estado de la receta a aprobada
        recipe.estado = 'aprobada';

        // Guardar el cambio en la base de datos
        const recetaActualizada = await recipe.save();

        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ message: 'Receta aprobada correctamente', recipe: recetaActualizada }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Error al aprobar la receta', details: error.message }));
    }
};

// Función para rechazar una receta
controller.rechazarReceta = async (req, res) => {
    try {
        const { recipeId } = req.body;

        if (!recipeId) {
            return res.writeHead(400, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ error: 'Se requiere el ID de la receta' }));
        }

        const recipe = await Receta.findById(recipeId);
        if (!recipe) {
            return res.writeHead(404, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ error: 'Receta no encontrada' }));
        }

        // Cambiar el estado de la receta a 'rechazada'
        recipe.estado = 'rechazada';

        // Guardar el cambio en la base de datos
        const recetaActualizada = await recipe.save();

        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ message: 'Receta rechazada correctamente', recipe: recetaActualizada }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ error: 'Error al rechazar la receta', details: error.message }));
    }
};

// Función para obtener todas las recetas
controller.obtenerTodasRecetas = async (req, res) => {
    try {
        const recetas = await Receta.find().populate('autor', 'nombre');

        // Verificar si cada receta tiene los campos completos
        const recetasConDatosCompletos = recetas.map(receta => ({
            id: receta._id,
            titulo: receta.nombreReceta,
            ingredientes: receta.ingredientes.join(', '),  // Asumiendo que ingredientes es un array
            preparacion: receta.preparacion || 'Sin preparación',  // Asegúrate de que preparacion tenga valor por defecto
            autor: receta.autor ? receta.autor.nombre : 'Desconocido',
            categoria: receta.categoria || 'Sin categoría',  // Si la categoría no existe
            descripcion: receta.descripcion || 'Sin descripción', 
            porciones: receta.porciones || 'Sin porciones', 
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ recetas: recetasConDatosCompletos }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ok: false,
            msg: 'Error al obtener las recetas',
            error: error.message || 'Error interno del servidor',
        }));
    }
};

controller.obtenerRecetaPorId = async (req, res) => {
    try {
        const id = req.params.id;

        // Comprobar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID de receta no válido' }));
            return;
        }

        const receta = await Receta.findById(id).populate('autor', 'nombre');
        if (!receta) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Receta no encontrada' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(receta));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al obtener la receta', details: error.message }));
    }
};


controller.buscarRecetasPorFiltro = async (req, res) => {
    const { nombreReceta, ingredientes, categoria } = req.query;
    const filtro = {};

    if (nombreReceta) filtro.nombreReceta = new RegExp(nombreReceta, 'i');
    if (ingredientes) filtro.ingredientes = { $in: [ingredientes] };
    if (categoria) filtro.categoria = { $regex: new RegExp(categoria, 'i') };

    try {
        const recetas = await Receta.find(filtro).populate('autor', 'nombre');
        
        // Verificar si cada receta tiene los campos completos
        const recetasConDatosCompletos = recetas.map(receta => ({
            id: receta._id,
            titulo: receta.nombreReceta || 'Sin título',
            ingredientes: receta.ingredientes.join(', '),  // Asumiendo que ingredientes es un array
            preparacion: receta.preparacion || 'Sin preparación',  // Asegúrate de que preparacion tenga valor por defecto
            autor: receta.autor ? receta.autor.nombre : 'Desconocido',
            categoria: receta.categoria || 'Sin categoría',  // Si la categoría no existe
            descripcion: receta.descripcion || 'Sin descripción', 
            porciones: receta.porciones || 'Sin porciones', 
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ recetas: recetasConDatosCompletos }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Error al buscar recetas', error: error.message }));
    }
};

// Función para actualizar una receta
controller.actualizarReceta = async (req, res) => {
    const recetaId = req.params.id;
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const actualizacion = JSON.parse(body);
            const recetaActualizada = await Receta.findByIdAndUpdate(recetaId, actualizacion, { new: true });

            if (!recetaActualizada) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                   .end(JSON.stringify({ mensaje: 'Receta no encontrada' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ mensaje: 'Receta actualizada', receta: recetaActualizada }));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ mensaje: 'Error al actualizar la receta', error: error.message }));
        }
    });
};

// Función para eliminar una receta
controller.eliminarReceta = async (req, res) => {
    const recetaId = req.params.id;

    try {
        const recetaEliminada = await Receta.findByIdAndDelete(recetaId);

        if (!recetaEliminada) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ mensaje: 'Receta no encontrada' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ mensaje: 'Receta eliminada correctamente' }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ mensaje: 'Error al eliminar la receta', error: error.message }));
    }
};

module.exports = controller;
