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
                const { nombreReceta, ingredientes, preparacion, categoria } = JSON.parse(body);

                const nuevaReceta = new Receta({
                    nombreReceta,
                    ingredientes,
                    preparacion,
                    categoria,
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

controller.aceptarReceta = async (req, res) => {
    try {
        const { recipeId } = req.body; // Asegúrate de que recipeId se pase correctamente en el cuerpo

        if (!recipeId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Se requiere el ID de la receta' }));
        }

        const recipe = await Receta.findById(recipeId);
        if (!recipe) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Receta no encontrada' }));
        }

        // Cambiar el estado de la receta a 'aprobada'
        recipe.estado = 'aprobada';
        
        // Guardar el cambio en la base de datos
        const recetaActualizada = await recipe.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Receta aprobada correctamente', recipe: recetaActualizada }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al aprobar la receta', details: error.message }));
    }
};

// Función para rechazar una receta
controller.rechazarReceta = async (req, res) => {
    try {
        console.log("req.body:", req.body);  // Verifica si req.body tiene el valor esperado
        
        const { recipeId } = req.body || {};  // Destructuración con fallback vacío

        if (!recipeId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Se requiere el ID de la receta' }));
        }

        const recipe = await Receta.findById(recipeId);
        if (!recipe) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Receta no encontrada' }));
        }

        // Cambiar el estado de la receta a 'rechazada'
        recipe.estado = 'rechazada';

        // Guardar el cambio en la base de datos
        const recetaActualizada = await recipe.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Receta rechazada correctamente', recipe: recetaActualizada }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al rechazar la receta', details: error.message }));
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

// Función para buscar recetas por filtros, incluyendo categoría
controller.buscarRecetasPorFiltro = async (req, res) => {
    const { nombreReceta, ingredientes, categoria } = req.query;
    const filtro = {};

    // Filtro por nombreReceta si existe
    if (nombreReceta) filtro.nombreReceta = new RegExp(nombreReceta, 'i');

    // Filtro por ingredientes si existe
    if (ingredientes) filtro.ingredientes = { $in: [ingredientes] };

    // Filtro por categoria, asegurándose de que el valor sea insensible a mayúsculas/minúsculas
    if (categoria) {
        filtro.categoria = { $regex: new RegExp(categoria, 'i') }; // Compara sin importar mayúsculas/minúsculas
    }

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
