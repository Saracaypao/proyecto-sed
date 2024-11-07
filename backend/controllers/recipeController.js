const Receta = require('../models/recipeModel');

const controller = {};

// Función para agregar una receta
controller.agregarReceta = async (req, res) => {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { nombreReceta, ingredientes, preparacion } = JSON.parse(body);

                const nuevaReceta = new Receta({
                    nombreReceta,
                    ingredientes,
                    preparacion,
                    imagen: '' // Opcionalmente, agregar lógica para manejar la imagen
                });

                await nuevaReceta.save();

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Receta agregada exitosamente' }));
            } catch (parseError) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Error en el formato JSON', error: parseError.message }));
            }
        });
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ok: false,
            msg: 'Error interno del servidor',
            error: error.message || 'Error interno del servidor',
        }));
    }
};

// Función para obtener todas las recetas
controller.obtenerTodasRecetas = async (req, res) => {
    try {
        const recetas = await Receta.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ recetas }));
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

// Función para buscar recetas por filtro
controller.buscarRecetasPorFiltro = async (req, res) => {
    const { nombreReceta, ingredientes } = req.query;
    const filtro = {};

    if (nombreReceta) filtro.nombreReceta = new RegExp(nombreReceta, 'i');
    if (ingredientes) filtro.ingredientes = { $in: [ingredientes] };

    try {
        const recetas = await Receta.find(filtro);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ recetas }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Error al buscar recetas', error: error.message }));
    }
};

// Función para actualizar una receta específica
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
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: 'Receta no encontrada' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Receta actualizada exitosamente', receta: recetaActualizada }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Error al actualizar la receta', error: error.message }));
        }
    });
};

// Función para eliminar una receta específica
controller.eliminarReceta = async (req, res) => {
    const recetaId = req.params.id;

    try {
        const recetaEliminada = await Receta.findByIdAndDelete(recetaId);

        if (!recetaEliminada) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Receta no encontrada' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Receta eliminada exitosamente' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Error al eliminar la receta', error: error.message }));
    }
};

module.exports = controller;
