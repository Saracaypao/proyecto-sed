function volver() {
    const referrer = document.referrer; // url de la página anterior

    // verificamos si la página anterior es la de inicio o la de recetas
    if (referrer.includes('index.html')) {
        window.location.href = 'index.html'; 
    } else if (referrer.includes('recetas.html')) {
        window.location.href = 'recetas.html'; 
    } else {
        // si no se puede determinar, redirige a un lugar predeterminado
        window.location.href = 'recetas.html';
    }
}

async function cargarRecetaCompleta() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const token = localStorage.getItem('token');  

    // Verificar si el token existe
    if (!token) {
        throw new Error('Token no encontrado');
    }

    if (recipeId && recipeId !== 'undefined') {
        try {
            const response = await fetch(`http://localhost:3000/api/recipe/${recipeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('No se pudo obtener la receta');
            }

            const receta = await response.json();
            const usuarioIdActual = JSON.parse(atob(token.split('.')[1])).userId;

            // Llenar los detalles de la receta en la página
            document.getElementById('nombreReceta').innerText = receta.nombreReceta || 'Sin nombre';
            document.getElementById('categoria').innerText = receta.categoria || 'Sin categoría';
            document.getElementById('porciones').innerText = receta.porciones || 'No especificado';

            // Manejar autor desconocido
            if (receta.autor && receta.autor.nombre) {
                document.getElementById('autor').innerText = receta.autor.nombre;
            } else {
                document.getElementById('autor').innerText = 'Desconocido';
            }

            // Mostrar u ocultar botones según el autor
            if (receta.autor && receta.autor._id === usuarioIdActual) {
                document.querySelector('.btn-edit').style.display = 'inline-block';
                document.querySelector('.btn-delete').style.display = 'inline-block';
            } else {
                document.querySelector('.btn-edit').style.display = 'none';
                document.querySelector('.btn-delete').style.display = 'none';
            }

            // Ingredientes
            const ingredientsList = document.getElementById('ingredientes');
            ingredientsList.innerHTML = '';
            if (Array.isArray(receta.ingredientes) && receta.ingredientes.length > 0) {
                receta.ingredientes.forEach(item => {
                    const li = document.createElement('li');
                    li.innerText = item;
                    ingredientsList.appendChild(li);
                });
            } else {
                ingredientsList.innerHTML = '<li>No se encontraron ingredientes.</li>';
            }

            // Instrucciones
            const instructionsText = document.getElementById('preparacion');
            instructionsText.innerText = receta.preparacion || 'No se encontraron instrucciones.';

            // Descripción
            const descriptionText = document.getElementById('descripcion');
            descriptionText.innerText = receta.descripcion || 'Sin descripción.';
            
        } catch (error) {
            console.error('Error al cargar la receta:', error);
        }
    } else {
        console.error('ID de receta no definido');
    }
}

window.onload = cargarRecetaCompleta;
