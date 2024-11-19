const Categoria = require('../models/categoryModel');

// función para agregar una nueva categoria
const agregarCategoria = async (req, res) => {
    const { nombre } = req.body;
    const currentUser = req.user;

    // verificar que el usuario sea admin o super_admin
    if (!currentUser.roles.includes('super_admin') && !currentUser.roles.includes('admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo admin y super_admin pueden agregar categorías." }));
        return;
    }

    try {
        // crear una nueva categoría
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

// función para editar una categoria existente
const editarCategoria = async (req, res) => {
    const categoriaId = req.url.split('/').pop(); // Obtener el ID de la categoría desde la URL
    const { nombre } = req.body;
    const currentUser = req.user;

    // verificar que el usuario sea admin o super_admin
    if (!currentUser.roles.includes('super_admin') && !currentUser.roles.includes('admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo admin y super_admin pueden editar categorías." }));
        return;
    }

    try {
        // buscar la categoria por id
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Categoría no encontrada." }));
            return;
        }

        // actualizar la categoria con la nueva informacion
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

// función para eliminar una categoria existente
const eliminarCategoria = async (req, res) => {
    const categoriaId = req.url.split('/').pop(); // Obtener el ID de la categoría desde la URL
    const currentUser = req.user;

    // verificar que el usuario sea admin o super_admin
    if (!currentUser.roles.includes('super_admin') && !currentUser.roles.includes('admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo admin y super_admin pueden eliminar categorías." }));
        return;
    }

    try {
        // buscar la categoria por id
        const categoria = await Categoria.findByIdAndDelete(categoriaId);
        if (!categoria) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Categoría no encontrada." }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: "Categoría eliminada con éxito." }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al eliminar la categoría', details: error.message }));
    }
};

// función para obtener todas las categorías
const obtenerTodasCategorias = async (req, res) => {
    try {
        // Buscar todas las categorías en la base de datos
        const categorias = await Categoria.find();

        // Si no hay categorías, respondemos con un mensaje adecuado
        if (!categorias || categorias.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'No se encontraron categorías.' }));
            return;
        }

        // Si se encontraron categorías, devolvemos los datos en formato JSON
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(categorias));  // Enviar todas las categorías
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al obtener las categorías', details: error.message }));
    }
};

module.exports = { agregarCategoria, editarCategoria, eliminarCategoria, obtenerTodasCategorias };


module.exports = { agregarCategoria, editarCategoria, eliminarCategoria };
