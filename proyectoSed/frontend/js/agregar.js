function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        console.error("Error al decodificar el token:", error.message);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log("No estás logueado. Redirigiendo al login...");
        window.location.href = '/login';
        return;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.correo) {
        console.error("Token inválido o sin campo 'correo'");
        window.location.href = '/login';
        return;
    }

    const correoUsuario = decoded.correo;
    const campoAutor = document.getElementById('autor');
    if (campoAutor && correoUsuario) {
        campoAutor.value = correoUsuario;
    } else {
        console.warn("Campo 'autor' o 'correoUsuario' no encontrado.");
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const receta = {
                nombreReceta: document.getElementById('nombreReceta').value,
                ingredientes: document.getElementById('ingredientes').value.split('\n'),
                preparacion: document.getElementById('preparacion').value,
                categoria: document.getElementById('categoria').value,
                descripcion: document.getElementById('descripcion').value,
                porciones: document.getElementById('porciones').value,
                autor: correoUsuario
            };

            if (!receta.nombreReceta || !receta.ingredientes.length || !receta.categoria) {
                alert("Por favor, completa todos los campos obligatorios.");
                return;
            }

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
                window.location.href = 'recetas.html';
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    } else {
        console.error('Formulario no encontrado');
    }
});
