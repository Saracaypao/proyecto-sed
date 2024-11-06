const Receta = require('../models/recipeModel');

const controller = {};

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

module.exports = controller;
