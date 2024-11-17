// Función para decodificar el token JWT
function decodeToken(token) {
    const payload = token.split('.')[1]; // Obtener la parte central del token
    const decoded = JSON.parse(atob(payload)); // Decodificar base64
    return decoded;
}

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el token está en localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log("No estás logueado. Redirigiendo al login...");
        // Redirigir al usuario al login si no hay token
        window.location.href = '/login';  // Redirige al login
        return;  // Salir de la función si no hay token
    } else {
        console.log("Encabezado Authorization:", token); // Mostrar el token para verificar si se mantuvo
    }

    // Decodificar el token para obtener el correo del usuario
    const decoded = decodeToken(token);
    const correoUsuario = decoded.correo; // Suponiendo que 'correo' está en el token

    // Colocar el correo del usuario en el campo "autor"
    const campoAutor = document.getElementById('autor');
    if (campoAutor) {
        campoAutor.value = correoUsuario; // Asigna el correo al campo autor
    }

    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita el envío predeterminado del formulario

            // Recopila los datos del formulario
            const nombreReceta = document.getElementById('nombreReceta').value;
            const ingredientes = document.getElementById('ingredientes').value.split('\n');
            const preparacion = document.getElementById('preparacion').value;
            const categoria = document.getElementById('categoria').value;
    
            // Envía la receta con el token
            const receta = {
                nombreReceta,
                ingredientes,
                preparacion,
                categoria,
                autor: correoUsuario,  // Incluye el correo del autor en el objeto de la receta
                imagen: '' // Puedes agregar lógica para manejar la imagen si es necesario
            };

            try {
                const response = await fetch('http://localhost:3000/api/recipe/newRecetas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Agregar el token aquí
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
