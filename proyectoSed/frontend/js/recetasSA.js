
function cargarRecetas() {
    fetch('http://localhost:3000/api/recipe/allRecetas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las recetas');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = ''; // limpiar las filas existentes

            data.recetas.forEach(receta => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${receta.titulo}</td>
                    <td>${receta.autor}</td>
                    <td>${receta.categoria}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="editarReceta('${receta.id}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarReceta('${receta.id}')">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            //console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las recetas.',
            });
        });
}

function editarReceta(recetaId) {
    fetch(`http://localhost:3000/api/recipe/allRecetas`)
        .then(response => response.json())
        .then(data => {
            const recetaActual = data.recetas.find(receta => receta.id === recetaId);

            const modalHTML = `
                <div class="modal fade" id="editarRecetaModal" tabindex="-1" role="dialog" aria-labelledby="editarRecetaLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header custom-modal-header">
                                <h5 class="modal-title" id="editarRecetaLabel">Editar Receta</h5>
                                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="formEditarReceta">
                                    <div class="form-group">
                                        <label for="titulo">Título de la receta</label>
                                        <input type="text" class="form-control" id="titulo" value="${recetaActual.titulo}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="categoria">Categoría</label>
                                        <select class="form-control" id="categoria">
                                            <option ${recetaActual.categoria === 'Entradas' ? 'selected' : ''}>Entradas</option>
                                            <option ${recetaActual.categoria === 'Platos principales' ? 'selected' : ''}>Platos principales</option>
                                            <option ${recetaActual.categoria === 'Complementos' ? 'selected' : ''}>Complementos</option>
                                            <option ${recetaActual.categoria === 'Bebidas' ? 'selected' : ''}>Bebidas</option>
                                            <option ${recetaActual.categoria === 'Postres' ? 'selected' : ''}>Postres</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="descripcion">Descripción</label>
                                        <textarea class="form-control" id="descripcion" rows="4" required>${recetaActual.descripcion}</textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn custom-save-btn" id="guardarCambios">Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            $('#editarRecetaModal').modal('show');

            document.getElementById('guardarCambios').addEventListener('click', () => {
                const titulo = document.getElementById('titulo').value.trim();
                const categoria = document.getElementById('categoria').value;
                const descripcion = document.getElementById('descripcion').value.trim();

                if (!titulo || !categoria || !descripcion) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Todos los campos son obligatorios.',
                    });
                    return;
                }

                fetch(`http://localhost:3000/api/recipe/update/${recetaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombreReceta: titulo,
                        categoria,
                        descripcion,
                    }),
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Error al actualizar la receta');
                        return response.json();
                    })
                    .then(data => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Receta actualizada',
                            text: data.mensaje,
                        });
                        $('#editarRecetaModal').modal('hide'); 
                        cargarRecetas(); 
                    })
                    .catch(error => {
                        //console.error(error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo actualizar la receta.',
                        });
                    });
            });

            $('#editarRecetaModal').on('hidden.bs.modal', function () {
                this.remove();
            });
        })
        .catch(error => {
            //console.error('Error al cargar receta para editar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la receta para editar.',
            });
        });
}

function eliminarReceta(recetaId) {

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la receta de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`http://localhost:3000/api/recipe/delete/${recetaId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar la receta');
                    }
                    return response.json();
                })
                .then((data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminada',
                        text: data.mensaje || 'La receta ha sido eliminada correctamente.',
                    });
                    cargarRecetas(); 
                })
                .catch((error) => {
                    //console.error('Error al eliminar la receta:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar la receta.',
                    });
                });
        }
    });
}

// cargar recetas al cargar la página
document.addEventListener('DOMContentLoaded', cargarRecetas);
