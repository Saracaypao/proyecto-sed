
// Obtener recetas
async function obtenerRecetas() {
    try {
        const response = await fetch('http://localhost:3000/api/recipe/allRecetas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener las recetas');
        }

        const data = await response.json();
        mostrarRecetas(data.recetas);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Mostrar recetas en el HTML
function mostrarRecetas(recetas) {
    const contenedor = document.querySelector('.row');
    contenedor.innerHTML = ''; // Limpiar el contenido actual

    recetas.forEach(receta => {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4');
        card.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-header bg-secondary text-white">
                    <h5 class="card-title mb-0">${receta.titulo}</h5>
                </div>
                <div class="card-body">
                    <p><strong>Categoría:</strong> ${receta.categoria}</p>
                    <p><strong>Porciones:</strong> ${receta.porciones}</p>
                    <p><strong>Autor:</strong> ${receta.autor}</p>
                    <p><strong>Descripción:</strong> ${receta.descripcion}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm btn-edit" data-id="${receta.id}">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${receta.id}">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Asignar eventos de editar y eliminar después de que las recetas se carguen
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', editarReceta);
    });
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', eliminarReceta);
    });
}

// Función para editar una receta
async function editarReceta(event) {
    const recetaId = event.target.getAttribute('data-id');
    try {
        const response = await fetch(`http://localhost:3000/api/recipe/${recetaId}`);
        const receta = await response.json();
        
        // Agrega un console.log para ver el nombre de la receta
        //console.log("Nombre de la receta a editar:", receta.nombreReceta);  

        Swal.fire({
            title: 'Editar Receta',
            html: `
                <input type="text" id="editTitulo" class="form-control mb-3" value="${receta.nombreReceta}" placeholder="Título de la receta">
                <input type="text" id="editCategoria" class="form-control mb-3" value="${receta.categoria}" placeholder="Categoría">
                <textarea id="editDescripcion" class="form-control mb-3" placeholder="Descripción">${receta.descripcion}</textarea>
                <input type="number" id="editPorciones" class="form-control mb-3" value="${receta.porciones}" placeholder="Porciones">
                <input type="text" id="editIngredientes" class="form-control mb-3" value="${receta.ingredientes.join(',')}" placeholder="Ingredientes (separados por comas)">
                <textarea id="editInstrucciones" class="form-control mb-3" placeholder="Instrucciones">${receta.preparacion}</textarea>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const titulo = $('#editTitulo').val();
                const categoria = $('#editCategoria').val();
                const descripcion = $('#editDescripcion').val();
                const porciones = $('#editPorciones').val();
                const ingredientes = $('#editIngredientes').val().split(',');
                const instrucciones = $('#editInstrucciones').val();

                // Solo se enviarán los campos que hayan sido modificados
                const updatedReceta = {};
                if (titulo !== receta.titulo) updatedReceta.nombreReceta = titulo;
                if (categoria !== receta.categoria) updatedReceta.categoria = categoria;
                if (descripcion !== receta.descripcion) updatedReceta.descripcion = descripcion;
                if (porciones != receta.porciones) updatedReceta.porciones = porciones;
                if (ingredientes.join(',') !== receta.ingredientes.join(',')) updatedReceta.ingredientes = ingredientes;
                if (instrucciones !== receta.preparacion) updatedReceta.instrucciones = instrucciones;

                if (Object.keys(updatedReceta).length === 0) {
                    Swal.showValidationMessage('No se realizaron cambios');
                    return false;
                }

                return updatedReceta;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedReceta = result.value;
                if (updatedReceta) {
                    // Enviar los datos al backend para actualizar la receta
                    actualizarReceta(recetaId, updatedReceta);
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener la receta para editarla:', error);
    }
}

// Función para actualizar la receta
async function actualizarReceta(recetaId, updatedReceta) {
    try {
        const response = await fetch(`http://localhost:3000/api/recipe/update/${recetaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedReceta)
        });

        if (response.ok) {
            Swal.fire('¡Receta actualizada!', 'Los cambios se han guardado correctamente.', 'success')
                .then(() => location.reload());
        } else {
            Swal.fire('Error', 'Hubo un problema al actualizar la receta.', 'error');
        }
    } catch (error) {
        console.error('Error al actualizar la receta:', error);
        Swal.fire('Error', 'Hubo un error al intentar actualizar la receta.', 'error');
    }
}

// Función para eliminar una receta
async function eliminarReceta(event) {
    const recetaId = event.target.getAttribute('data-id');
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:3000/api/recipe/delete/${recetaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                Swal.fire('Eliminada', 'La receta ha sido eliminada.', 'success')
                    .then(() => location.reload());
            } else {
                Swal.fire('Error', 'Hubo un problema al eliminar la receta.', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar la receta:', error);
            Swal.fire('Error', 'Hubo un error al intentar eliminar la receta.', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', obtenerRecetas);
