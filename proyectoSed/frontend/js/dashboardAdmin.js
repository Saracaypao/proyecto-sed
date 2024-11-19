document.addEventListener('DOMContentLoaded', () => {
    obtenerTotalRecetas(); // Llamada a la función cuando el documento esté cargado
});

// Función para obtener el total de recetas desde el backend
const obtenerTotalRecetas = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/recipe/allRecetas'); // End-point para obtener las recetas
        const data = await response.json();

        if (response.ok) {
            // Contando el total de recetas
            const totalRecetas = data.recetas.length; // Asumiendo que 'recetas' es un array

            // Actualizando el contenido de la tarjeta con el total de recetas
            document.getElementById('totalRecetas').innerText = totalRecetas;
        } else {
            console.error('Error al obtener las recetas', data);
        }
    } catch (error) {
        console.error('Error en la solicitud', error);
    }
};
