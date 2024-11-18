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
        Swal.fire({
            icon: 'warning',
            title: 'No estás logueado',
            text: 'Por favor, inicia sesión para continuar.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ir al login'
        }).then(() => {
            window.location.href = 'landingpage.html';  // Redirige al login
        });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos antes de enviar.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // Enviar los datos de la receta al servidor
            const receta = {
                nombreReceta,
                ingredientes,  
                preparacion,
                categoria,
                porciones,
                autor: correoUsuario,
                imagen: '', 
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.mensaje || 'Error al agregar la receta.',
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Cerrar'
                    });
                    throw new Error(error.mensaje || 'Error al agregar la receta');
                }

                const data = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Receta agregada',
                    text: data.mensaje,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = 'recetas.html';
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de servidor',
                    text: 'Hubo un problema. Intenta nuevamente más tarde.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Cerrar'
                });
                console.error(`Error: ${error.message}`);
            }
        });
    } else {
        console.error('Formulario no encontrado');
    }
});
