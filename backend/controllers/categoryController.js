const Categoria = require('../models/categoryModel');

const agregarCategoria = async (req, res) => {
    const { nombre } = req.body;
    const currentUser = req.user;

    if (!currentUser.roles.includes('super_admin') && !currentUser.roles.includes('admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo admin y super_admin pueden agregar categorías." }));
        return;
    }

    try {
      
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

const editarCategoria = async (req, res) => {
    const categoriaId = req.url.split('/').pop(); 
    const { nombre } = req.body;
    const currentUser = req.user;

    if (!currentUser.roles.includes('super_admin') && !currentUser.roles.includes('admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo admin y super_admin pueden editar categorías." }));
        return;
    }

    try {
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Categoría no encontrada." }));
            return;
        }

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

const eliminarCategoria = async (req, res) => {
    const categoriaId = req.url.split('/').pop(); 
    const currentUser = req.user;

    if (!currentUser.roles.includes('super_admin') && !currentUser.roles.includes('admin')) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Permiso denegado: solo admin y super_admin pueden eliminar categorías." }));
        return;
    }

    try {

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

const obtenerTodasCategorias = async (req, res) => {
    try {

        const categorias = await Categoria.find();

        if (!categorias || categorias.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'No se encontraron categorías.' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(categorias));  
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al obtener las categorías', details: error.message }));
    }
};

module.exports = { agregarCategoria, editarCategoria, eliminarCategoria, obtenerTodasCategorias };


module.exports = { agregarCategoria, editarCategoria, eliminarCategoria };
