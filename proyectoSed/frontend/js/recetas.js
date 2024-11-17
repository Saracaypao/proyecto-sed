document.addEventListener('DOMContentLoaded', () => {
    const listaRecetas = document.getElementById('listaRecetas');

    async function cargarRecetas() {
        try {
            const token = localStorage.getItem('token');  // O de donde estés guardando el token
    
            // Verificar si el token existe
            if (!token) {
                throw new Error('Token no encontrado');
            }
    
            const respuesta = await fetch('http://localhost:3000/api/recipe/allRecetas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Incluir el token en los encabezados
                }
            });
    
            if (!respuesta.ok) {
                throw new Error('Error al obtener recetas');
            }
    
            const data = await respuesta.json();  // Obtener la respuesta completa
            console.log("Recetas recibidas:", data); // Ver la respuesta completa
    
            // Verificar si la propiedad 'recetas' es un array
            if (!Array.isArray(data.recetas)) {
                throw new Error('La propiedad "recetas" no es un array');
            }
    
            const recetas = data.recetas;  // Acceder al array de recetas
    
            const listaRecetas = document.getElementById('listaRecetas'); // Asegúrate de que el ID sea correcto
    
            if (listaRecetas) {
                listaRecetas.innerHTML = ''; // Limpiar lista actual
    
                // Recorremos las recetas y las mostramos
                recetas.forEach((receta) => { 
                    // Asegúrate de que las propiedades existan
                    const ingredientes = Array.isArray(receta.ingredientes) ? receta.ingredientes.join(', ') : 'Sin ingredientes';
                    const preparacion = receta.preparacion || 'Sin descripción';
                    const autor = receta.autor || 'Desconocido';
    
                    listaRecetas.innerHTML += `
                        <div class="col-md-4">
                            <div class="card shadow-sm">
                                <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="${receta.titulo}">
                                <div class="card-body">
                                    <h5 class="card-title">${receta.titulo}</h5>
                                    <p class="card-text"><strong>Ingredientes:</strong> ${ingredientes}</p>
                                    <p class="card-text"><strong>Preparación:</strong> ${preparacion}</p>
                                    <p class="text-muted"><strong>Categoría:</strong> ${receta.categoria || 'Sin categoría'}</p>
                                    <p class="text-muted"><strong>Autor:</strong> ${autor}</p>
                                    <a href="recetaCompleta.html?id=${receta.id}" class="btn btn-primary">Ver receta</a>
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
