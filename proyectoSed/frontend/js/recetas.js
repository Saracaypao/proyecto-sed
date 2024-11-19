document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.querySelector('.search-section input');
    const botonBusqueda = document.querySelector('.search-section button');
    const botonesCategoria = document.querySelectorAll('.category-button');
    let categoriaSeleccionada = null; // Variable para almacenar la categoría seleccionada

    // funcion para la paginación
    const configurarPaginacion = (recetas) => {
        $('#paginacion').pagination({
            dataSource: recetas,
            pageSize: 6,
            showNavigator: true,
            formatNavigator: '<span id="navegador"><%= currentPage %> de <%= totalPage %></span>',
            ulClassName: 'pagination justify-content-start',
            prevText: '&laquo;',
            nextText: '&raquo;',
            position: 'top',
            callback: function (data) {
                const listaRecetas = document.getElementById('listaRecetas');
                listaRecetas.innerHTML = '';
                data.forEach((receta) => {
                    const titulo = receta.titulo || 'Sin título';
                    const categoria = receta.categoria || 'Sin categoría';
                    const descripcion = receta.descripcion || 'Sin descripción';
                    const porciones = receta.porciones || 'N/A';
                    const autor = receta.autor || 'Desconocido';

                    listaRecetas.innerHTML += `
                        <div class="col-md-4">
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${titulo}</h5>
                                    <p class="text-muted"><strong>Categoría:</strong> ${categoria}</p>
                                    <p class="card-text"><strong>Descripción:</strong> ${descripcion}</p>
                                    <p class="card-text"><strong>Porciones:</strong> ${porciones}</p>
                                    <p class="text-muted"><strong>Autor:</strong> ${autor}</p>
                                    <a href="recetaCompleta.html?id=${receta.id}" class="btn btn-primary">Ver receta</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
            },
        });
    };

    // función para cargar recetas iniciales
    const cargarRecetas = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch('http://localhost:3000/api/recipe/allRecetas', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!respuesta.ok) throw new Error('Error al obtener recetas');

            const data = await respuesta.json();
            configurarPaginacion(data.recetas || []);
        } catch (error) {
            console.error('Error al cargar recetas:', error.message);
        }
    };

    // función para buscar recetas por nombre
    const buscarRecetas = async (termino) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`http://localhost:3000/api/recipe/search?nombreReceta=${encodeURIComponent(termino)}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!respuesta.ok) throw new Error('Error en la búsqueda');

            const data = await respuesta.json();

            const recetasFormateadas = (data.recetas || []).map(receta => ({
                id: receta.id || receta._id,
                titulo: receta.titulo || 'Sin título',
                categoria: receta.categoria || 'Sin categoría',
                descripcion: receta.descripcion || 'Sin descripción',
                porciones: receta.porciones || 'N/A',
                autor: receta.autor || 'Desconocido',
            }));

            configurarPaginacion(recetasFormateadas);
        } catch (error) {
            console.error('Error en la búsqueda:', error.message);
        }
    };

    // función para buscar recetas por categoría
    const buscarRecetasPorCategoria = async (categoria) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const respuesta = await fetch(`http://localhost:3000/api/recipe/search?categoria=${encodeURIComponent(categoria)}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!respuesta.ok) throw new Error('Error en la búsqueda por categoría');

            const data = await respuesta.json();

            const recetasFormateadas = (data.recetas || []).map(receta => ({
                id: receta.id || receta._id,
                titulo: receta.titulo || 'Sin título',
                categoria: receta.categoria || 'Sin categoría',
                descripcion: receta.descripcion || 'Sin descripción',
                porciones: receta.porciones || 'N/A',
                autor: receta.autor || 'Desconocido',
            }));

            configurarPaginacion(recetasFormateadas);
        } catch (error) {
            console.error('Error en la búsqueda por categoría:', error.message);
        }
    };

    // al hacer clic en el botón de búsqueda
    if (botonBusqueda) {
        botonBusqueda.addEventListener('click', () => {
            const terminoBusqueda = inputBusqueda.value.trim();
            if (!terminoBusqueda) {
                cargarRecetas(); // si el campo está vacío cargar recetas iniciales
            } else {
                buscarRecetas(terminoBusqueda);
            }
        });
    }

    // evento para detectar si el campo de búsqueda queda vacío
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', () => {
            if (inputBusqueda.value.trim() === '') {
                cargarRecetas(); // si el campo está vacío cargar recetas iniciales
            }
        });
    }

    // agregar evento para los botones de categoría
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.textContent.trim();

            // Si la categoría clickeada es la misma que la seleccionada, eliminamos el filtro
            if (categoriaSeleccionada === categoria) {
                categoriaSeleccionada = null;  // Restablecemos la categoría seleccionada
                cargarRecetas();  // Volvemos a cargar todas las recetas
            } else {
                categoriaSeleccionada = categoria;  // Establecemos la nueva categoría seleccionada
                buscarRecetasPorCategoria(categoria);  // Buscamos las recetas por la categoría seleccionada
            }
        });
    });

    // recetas iniciales al inicio
    cargarRecetas();
});
