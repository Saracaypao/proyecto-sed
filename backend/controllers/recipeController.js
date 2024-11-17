const { verifyToken } = require('../utils/jwt.tools');
const Receta = require('../models/recipeModel');
const Usuario = require('../models/userModel'); // Importa el modelo de usuario

const controller = {};

// Función para agregar una receta
controller.agregarReceta = async (req, res) => {
    try {
        console.log("Recibido request para agregar receta");

        // Obtener el token desde el encabezado Authorization
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'No autorizado, token no encontrado' }));
        }

        // Verificar el token y obtener la información del usuario
        const decoded = await verifyToken(token);

        // Depuración: Verificar el contenido del token
        console.log("Token decodificado:", decoded);

        if (!decoded || !decoded.userId) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'No autorizado, autor no encontrado' }));
        }

        // Obtener el correo del usuario desde la base de datos utilizando userId
        const usuario = await Usuario.findById(decoded.userId);
        if (!usuario) {
            return res.writeHead(404, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'Usuario no encontrado' }));
        }

        const autor = usuario.email; // Asumiendo que el campo de correo es "email"
        console.log("Correo del autor:", autor);

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { nombreReceta, ingredientes, preparacion, categoria } = JSON.parse(body);
                const nuevaReceta = new Receta({
                    autor: usuario._id, // Guarda el ObjectId del usuario como autor
                    nombreReceta,
                    ingredientes,
                    preparacion,
                    categoria,
                    imagen: ''
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
        const recetas = await Receta.find().populate('autor', 'nombre'); // Asegúrate de que el campo 'autor' exista en Receta

        // Si no hay recetas, responde un mensaje adecuado
        if (recetas.length === 0) {
            return res.writeHead(404, { 'Content-Type': 'application/json' })
                      .end(JSON.stringify({ mensaje: 'No hay recetas disponibles' }));
        }

        const recetasConAutor = recetas.map(receta => ({
            titulo: receta.nombreReceta,
            descripcion: receta.descripcion,
            autor: receta.autor?.nombre || 'Desconocido'  // Verificación del autor
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ recetas: recetasConAutor }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ ok: false, msg: 'Error al obtener las recetas', error: error.message }));
    }
};

// Función para obtener una receta por ID
controller.obtenerRecetaPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const receta = await Receta.findById(id).populate('autor', 'nombre'); // Poblamos 'autor' con el campo 'nombre'

        if (!receta) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ ok: false, msg: 'Receta no encontrada' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify(receta));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ ok: false, msg: 'Error al obtener la receta', error: error.message }));
    }
};

// Función para buscar recetas por filtros
controller.buscarRecetasPorFiltro = async (req, res) => {
    const { nombreReceta, ingredientes, categoria } = req.query;
    const filtro = {};

    if (nombreReceta) filtro.nombreReceta = new RegExp(nombreReceta, 'i');
    if (ingredientes) filtro.ingredientes = { $in: [ingredientes] };
    if (categoria) filtro.categoria = { $regex: new RegExp(categoria, 'i') };

    try {
        const recetas = await Receta.find(filtro);
        res.writeHead(200, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ recetas }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
           .end(JSON.stringify({ mensaje: 'Error al buscar recetas', error: error.message }));
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
               .end(JSON.stringify({ mensaje: 'Receta actualizada exitosamente', receta: recetaActualizada }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
               .end(JSON.stringify({ mensaje: 'Error al actualizar receta', error: error.message }));
        }
    });
};

module.exports = controller;
