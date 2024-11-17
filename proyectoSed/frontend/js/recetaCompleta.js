
    // Función para cargar la receta completa desde el servidor
    async function cargarRecetaCompleta() {
        const params = new URLSearchParams(window.location.search);
        const recetaId = params.get('id');  // Obtener el ID de la receta de la URL

        try {
            const response = await fetch(`http://localhost:3000/api/recipe/${recetaId}`);
            if (!response.ok) {
                throw new Error('Receta no encontrada');
            }
            const receta = await response.json();

            // Llenar los detalles de la receta en la página
            document.getElementById('nombreReceta').innerText = receta.nombreReceta;
            document.getElementById('categoria').innerText = receta.categoria;
            document.getElementById('autor').innerText = receta.autor; 

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
                instructionsText.innerText = receta.preparacion
            } else {
                instructionsText.innerHTML = '<p>No se encontraron instrucciones.</p>';
            }
        } catch (error) {
            console.error('Error al cargar la receta:', error);
            Swal.fire('Error', 'No se pudo cargar la receta', 'error');
        }
    }

    // Llamada a la función cuando se carga la página
    window.onload = cargarRecetaCompleta;