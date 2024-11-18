async function cargarRecetas() {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no encontrado');

        const respuesta = await fetch('http://localhost:3000/api/recipe/allRecetas', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!respuesta.ok) throw new Error('Error al obtener recetas');

        const data = await respuesta.json();
        const recetas = data.recetas;

        if (!Array.isArray(recetas)) throw new Error('La propiedad "recetas" no es un array');

        $('#paginacion').pagination({
            dataSource: recetas,
            pageSize: 6,
            showNavigator: true,
            formatNavigator: '<span id="navegador"><%= currentPage %> de <%= totalPage %></span>',
            //formatNavigator: '<%= rangeStart %>-<%= rangeEnd %> de <%= totalNumber %> recetas',
            ulClassName: 'pagination justify-content-start', // clase para Bootstrap
            showNavigator: true,
            prevText: '&laquo;', // botón anterior
            nextText: '&raquo;', // botón siguiente
            position: 'top',
            callback: function (data, pagination) {
                const listaRecetas = document.getElementById('listaRecetas');
                listaRecetas.innerHTML = ''; // limpia recetas previas
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
    } catch (error) {
        console.error('Error al cargar recetas:', error.message);
    }
}

// llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarRecetas);
