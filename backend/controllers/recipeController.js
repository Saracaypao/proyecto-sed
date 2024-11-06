const Receta = require('../models/recipeModel'); 

const controller = {};

controller.agregarReceta = async (req, res) => {
    try {
        let body = '';

        // Escuchar el evento 'data' para obtener el cuerpo de la solicitud
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Cuando se termine de recibir el cuerpo
        req.on('end', async () => {
            const { nombreReceta, ingredientes, preparacion } = JSON.parse(body);

            // Aquí debes crear una nueva receta
            const nuevaReceta = new Receta({
                nombre: nombreReceta,
                ingredientes: ingredientes,
                preparacion: preparacion,
                // Si deseas manejar la imagen, necesitarás un manejo adicional para subir archivos
                imagen: '', // Maneja la lógica de la imagen según tu implementación
            });

            // Guardar la nueva receta en la base de datos
            await nuevaReceta.save();

            // Enviar respuesta de éxito
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Receta agregada exitosamente' }));
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

module.exports = controller;
