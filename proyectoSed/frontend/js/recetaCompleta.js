async function cargarRecetaCompleta() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (recipeId && recipeId !== 'undefined') {
        try {
            const response = await fetch(`http://localhost:3000/api/recipe/${recipeId}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la receta');
            }

            const receta = await response.json();

            // Llenar los detalles de la receta en la página
            document.getElementById('nombreReceta').innerText = receta.nombreReceta || 'Sin nombre';
            document.getElementById('categoria').innerText = receta.categoria || 'Sin categoría';
            document.getElementById('porciones').innerText = receta.porciones || 'No especificado';
            document.getElementById('autor').innerText = receta.autor?.nombre || 'Desconocido';

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
