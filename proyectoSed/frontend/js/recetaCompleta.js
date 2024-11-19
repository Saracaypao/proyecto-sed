function volver() {
    const referrer = document.referrer; // url de la página anterior

    // verificando si la página anterior es la de inicio o la de recetas
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

    // verificando si el token existe
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

            // llenando los detalles de la receta en la página
            document.getElementById('nombreReceta').innerText = receta.nombreReceta || 'Sin nombre';
            document.getElementById('categoria').innerText = receta.categoria || 'Sin categoría';
            document.getElementById('porciones').innerText = receta.porciones || 'No especificado';

            // cuando hay un autor desconocido
            if (receta.autor && receta.autor.nombre) {
                document.getElementById('autor').innerText = receta.autor.nombre;
            } else {
                document.getElementById('autor').innerText = 'Desconocido';
            }

            // mostrar u ocultar botones segun el autor
            if (receta.autor && receta.autor._id === usuarioIdActual) {
                document.querySelector('.btn-edit').style.display = 'inline-block';
                document.querySelector('.btn-delete').style.display = 'inline-block';
            } else {
                document.querySelector('.btn-edit').style.display = 'none';
                document.querySelector('.btn-delete').style.display = 'none';
            }

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

            const instructionsText = document.getElementById('preparacion');
            instructionsText.innerText = receta.preparacion || 'No se encontraron instrucciones.';

            const descriptionText = document.getElementById('descripcion');
            descriptionText.innerText = receta.descripcion || 'Sin descripción.';
            
        } catch (error) {
            console.error('Error al cargar la receta:', error);
        }
    } else {
        console.error('ID de receta no definido');
    }
}

async function editarReceta() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    if (recipeId && recipeId !== 'undefined') {
        try {
            // obteniendo la receta existente para llenar el form
            const response = await fetch(`http://localhost:3000/api/recipe/${recipeId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener la receta para editarla.');
            }

            const receta = await response.json();

            // editar el form del modal con los datos existentes
            document.getElementById('editNombreReceta').value = receta.nombreReceta || '';
            document.getElementById('editCategoria').value = receta.categoria || '';
            document.getElementById('editDescripcion').value = receta.descripcion || '';
            document.getElementById('editPorciones').value = receta.porciones || '';
            document.getElementById('editIngredientes').value = (receta.ingredientes || []).join(',');
            document.getElementById('editInstrucciones').value = receta.preparacion || '';

            // logica para actualizar la receta al evento onsubmit del formulario
            document.getElementById('editRecipeForm').onsubmit = async function (event) {
                event.preventDefault();

                // capturando los datos del formulario
                const updatedReceta = {
                    nombreReceta: document.getElementById('editNombreReceta').value,
                    categoria: document.getElementById('editCategoria').value,
                    descripcion: document.getElementById('editDescripcion').value,
                    porciones: document.getElementById('editPorciones').value,
                    ingredientes: document.getElementById('editIngredientes').value.split(','),
                    preparacion: document.getElementById('editInstrucciones').value
                };

                // enviando los datos al backend
                const updateResponse = await fetch(`http://localhost:3000/api/recipe/update/${recipeId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedReceta)
                });

                if (updateResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Receta actualizada!',
                        text: 'La receta se actualizó correctamente.',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        location.reload(); 
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar la receta.',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'Cerrar'
                    });
                }
                
            };
        } catch (error) {
            console.error('Error al obtener la receta para editarla:', error);
        }
    }
}

async function eliminarReceta() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token no encontrado');
        return;
    }

    if (recipeId && recipeId !== 'undefined') {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:3000/api/recipe/delete/${recipeId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'La receta ha sido eliminada exitosamente.',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            volver() // modificar esto
                        });
                    } else {
                        throw new Error('No se pudo eliminar la receta');
                    }
                } catch (error) {
                    console.error('Error al eliminar la receta:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al intentar eliminar la receta.',
                        confirmButtonText: 'Cerrar'
                    });
                }
            }
        });
    }
    
}

// agregando event listeners a los botones de edición y eliminación
document.querySelector('.btn-edit').addEventListener('click', editarReceta);
document.querySelector('.btn-delete').addEventListener('click', eliminarReceta);

window.onload = cargarRecetaCompleta;
