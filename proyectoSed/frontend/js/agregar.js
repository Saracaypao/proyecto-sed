document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita el envío predeterminado del formulario

            // Recopila los datos del formulario
            const nombreReceta = document.getElementById('nombreReceta').value;
            const ingredientes = document.getElementById('ingredientes').value.split('\n');
            const preparacion = document.getElementById('preparacion').value;
            const categoria = document.getElementById('categoria').value;

            // Crea un objeto con los datos
            const receta = {
                nombreReceta,
                ingredientes,
                preparacion,
                categoria,
                imagen: '' // Implementar lógica de manejo de imagen si es necesario
            };

            try {
                // Enviar los datos a la API usando fetch
                const response = await fetch('http://localhost:3000/api/recipe/newRecetas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(receta)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.mensaje || 'Error al agregar la receta');
                }

                const data = await response.json();
                alert(data.mensaje || 'Receta agregada exitosamente');
                window.location.href = 'recetas.html'; // Redirecciona al listado de recetas
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    } else {
        console.error('Formulario no encontrado');
    }
});
