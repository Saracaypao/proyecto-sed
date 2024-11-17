async function cargarRecetaCompleta() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    console.log('ID de receta:', recipeId); // Agrega este log
    if (recipeId && recipeId !== 'undefined') {
        fetch(`http://localhost:3000/api/recipe/${recipeId}`)
            .then(response => response.json())
            .then(data => {
                const receta = data;
    
                // Llenar los detalles de la receta en la página
                document.getElementById('nombreReceta').innerText = receta.nombreReceta;
                document.getElementById('categoria').innerText = receta.categoria;
                document.getElementById('autor').innerText = receta.autor.nombre;  
    
                // Ingredientes (verificar si existe)
                const ingredientsList = document.getElementById('ingredientes');
                ingredientsList.innerHTML = '';
                if (Array.isArray(receta.ingredientes)) {
                    receta.ingredientes.forEach(item => {
                        const li = document.createElement('li');
                        li.innerText = item;
                        ingredientsList.appendChild(li);
                    });
                } else {
                    // Si no se encuentra la lista de ingredientes
                    ingredientsList.innerHTML = '<li>No se encontraron ingredientes.</li>';
                }
    
                // Instrucciones (mostrar como texto simple si no es lista)
                const instructionsText = document.getElementById('preparacion');
                if (typeof receta.preparacion === 'string') {
                    instructionsText.innerText = receta.preparacion;
                } else {
                    instructionsText.innerHTML = '<p>No se encontraron instrucciones.</p>';
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.error('ID de receta no definido');
    }   
}

window.onload = cargarRecetaCompleta;
