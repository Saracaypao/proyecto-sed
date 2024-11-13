const Categoria = require('../models/categoryModel');

// Función para agregar una nueva categoría
const agregarCategoria = async (req, res) => {
    const { nombre} = req.body;
    const currentUser = req.user;

    // Verificar que el usuario sea super_admin
    if (!currentUser.roles.includes('super_admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo el super_admin puede agregar categorías." }));
        return;
    }

    try {
        // Crear una nueva categoría
        const nuevaCategoria = new Categoria({ nombre });
        await nuevaCategoria.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: "Categoría agregada con éxito", categoria: nuevaCategoria }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al agregar la categoría', details: error.message }));
    }
};

// Función para editar una categoría existente
const editarCategoria = async (req, res) => {
    const categoriaId = req.url.split('/').pop(); // Obtener el ID de la categoría desde la URL
    const { nombre } = req.body;
    const currentUser = req.user;

    // Verificar que el usuario sea super_admin
    if (!currentUser.roles.includes('super_admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo el super_admin puede editar categorías." }));
        return;
    }

    try {
        // Buscar la categoría por ID
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Categoría no encontrada." }));
            return;
        }

        // Actualizar la categoría con la nueva información
        categoria.nombre = nombre || categoria.nombre;

        await categoria.save();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: "Categoría editada con éxito.", categoria }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al editar la categoría', details: error.message }));
    }
};

module.exports = { agregarCategoria, editarCategoria };