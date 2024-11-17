document.addEventListener('DOMContentLoaded', () => {
    const listaRecetas = document.getElementById('listaRecetas');

    async function cargarRecetas() {
        try {
            const respuesta = await fetch('http://localhost:3000/api/recipe/allRecetas');
            if (!respuesta.ok) {
                throw new Error('Error al obtener recetas');
            }
    
            const data = await respuesta.json(); // Obtener la respuesta completa
            console.log("Recetas recibidas:", data); // Ver la respuesta completa
    
            // Verificar si la propiedad 'recetas' es un array
            if (!Array.isArray(data.recetas)) {
                throw new Error('La propiedad "recetas" no es un array');
            }
    
            const recetas = data.recetas;  // Acceder al array de recetas
    
            if (listaRecetas) {
                listaRecetas.innerHTML = ''; // Limpiar lista actual
                recetas.forEach((receta) => {
                    listaRecetas.innerHTML += `
                        <div class="col-md-4">
                            <div class="card shadow-sm">
                                <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="${receta.nombreReceta}">
                                <div class="card-body">
                                    <h5 class="card-title">${receta.nombreReceta}</h5>
                                    <p class="card-text"><strong>Ingredientes:</strong> ${receta.ingredientes.join(', ')}</p>
                                    <p class="card-text"><strong>Preparación:</strong> ${receta.preparacion}</p>
                                    <p class="text-muted"><strong>Categoría:</strong> ${receta.categoria}</p>
                                    <a href="recetaCompleta.html?id=${receta._id}" class="btn btn-primary">Ver receta</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                console.error('Elemento #listaRecetas no encontrado en el DOM');
            }
        } catch (error) {
            console.error('Error al cargar recetas:', error.message);
        }
    }
    

    // Llama a la función al cargar la página
    cargarRecetas();
});
