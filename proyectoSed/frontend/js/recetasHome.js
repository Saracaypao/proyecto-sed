document.addEventListener('DOMContentLoaded', () => {
    const listaRecetasHome = document.querySelector('.container .row'); 

    async function cargarRecetasHome() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Token no encontrado');
            }

            const respuesta = await fetch('http://localhost:3000/api/recipe/allRecetas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!respuesta.ok) {
                throw new Error('Error al obtener recetas');
            }

            const data = await respuesta.json();
            const recetasHome = data.recetas.slice(-6);

            if (listaRecetasHome) {
                listaRecetasHome.innerHTML = ''; // limpiar contenido existente

                recetasHome.forEach((receta) => {
                    const titulo = receta.titulo || 'Sin título';
                    const descripcion = receta.descripcion || 'Sin descripción';
                    const autor = receta.autor || 'Desconocido';
                    const id = receta.id;

                    listaRecetasHome.innerHTML += `
                        <div class="col-md-4">
                            <div class="card shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${titulo}</h5>
                                    <p class="card-text"><strong>Descripción:</strong> ${descripcion}</p>
                                    <p class="text-muted"><strong>Autor:</strong> ${autor}</p>
                                    <a href="recetaCompleta.html?id=${id}" class="btn btn-primary">Ver receta</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                console.error('Elemento contenedor de recetas no encontrado');
            }
        } catch (error) {
            console.error('Error al cargar recetas:', error.message);
        }
    }

    cargarRecetasHome();
});
