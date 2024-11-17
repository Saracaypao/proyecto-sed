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
        window.location.href = 'landingpage.html';  // Redirige al login
        return;
    }

    const decoded = decodeToken(token);
    const correoUsuario = decoded.correo;

    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Recopila los datos del formulario
            const nombreReceta = document.getElementById('nombreReceta').value;
            const ingredientesRaw = document.getElementById('ingredientes').value.trim();
            const preparacion = document.getElementById('preparacion').value;
            const categoria = document.getElementById('categoria').value;
            const porciones = document.getElementById('porciones').value;
            const descripcion = document.getElementById('descripcion').value;

            // Procesa los ingredientes para asegurarse de que sea un array no vacío
            const ingredientes = ingredientesRaw ? ingredientesRaw.split('\n').map(i => i.trim()).filter(i => i.length > 0) : [];
            
            // Verifica que los datos del formulario estén completos antes de enviarlos
            if (!nombreReceta || ingredientes.length === 0 || !preparacion || !categoria || !porciones || !descripcion) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Enviar los datos de la receta al servidor
            const receta = {
                nombreReceta,
                ingredientes,  // Asegúrate de que ingredientes es un array válido
                preparacion,
                categoria,
                porciones,
                autor: correoUsuario,
                imagen: '', // Puedes agregar la lógica de la imagen si es necesario
                descripcion
            };

            try {
                const response = await fetch('http://localhost:3000/api/recipe/newRecetas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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
