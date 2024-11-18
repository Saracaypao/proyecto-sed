document.addEventListener('DOMContentLoaded', () => {
    const listaRecetas = document.getElementById('listaRecetas');

    async function cargarRecetas() {
        try {
            const token = localStorage.getItem('token');  

            // verificar si el token existe
            if (!token) {
                throw new Error('Token no encontrado');
            }

            const respuesta = await fetch('http://localhost:3000/api/recipe/allRecetas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // incluir el token en los encabezados
                }
            });

            if (!respuesta.ok) {
                throw new Error('Error al obtener recetas');
            }

            const data = await respuesta.json();  // obtener la respuesta completa
            console.log("Recetas recibidas:", data); // ver la respuesta completa

            // verificar si la propiedad 'recetas' es un array
            if (!Array.isArray(data.recetas)) {
                throw new Error('La propiedad "recetas" no es un array');
            }

            const recetas = data.recetas;  // acceder al array de recetas

            if (listaRecetas) {
                listaRecetas.innerHTML = ''; // limpiar lista actual

                // recorremos las recetas y las mostramos
                recetas.forEach((receta) => { 
                    // validar propiedades de la receta
                    const titulo = receta.titulo || 'Sin título';
                    const ingredientes = Array.isArray(receta.ingredientes) ? receta.ingredientes.join(', ') : 'Sin ingredientes';
                    const preparacion = receta.preparacion || 'Sin descripción';
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
            } else {
                console.error('Elemento #listaRecetas no encontrado en el DOM');
            }
        } catch (error) {
            console.error('Error al cargar recetas:', error.message);
        }
    }

    // llama a la función al cargar la página
    cargarRecetas();
});
