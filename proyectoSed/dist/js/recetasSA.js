"use strict";

function cargarRecetas() {
  fetch('http://localhost:3000/api/recipe/allRecetas').then(function (response) {
    if (!response.ok) {
      throw new Error('Error al obtener las recetas');
    }
    return response.json();
  }).then(function (data) {
    var tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // limpiar las filas existentes

    data.recetas.forEach(function (receta) {
      var tr = document.createElement('tr');
      tr.innerHTML = "\n                    <td>".concat(receta.titulo, "</td>\n                    <td>").concat(receta.autor, "</td>\n                    <td>").concat(receta.categoria, "</td>\n                    <td>\n                        <button class=\"btn btn-success btn-sm\" onclick=\"editarReceta('").concat(receta.id, "')\">Editar</button>\n                        <button class=\"btn btn-danger btn-sm\" onclick=\"eliminarReceta('").concat(receta.id, "')\">Eliminar</button>\n                    </td>\n                ");
      tbody.appendChild(tr);
    });
  })["catch"](function (error) {
    //console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las recetas.'
    });
  });
}
function editarReceta(recetaId) {
  fetch("http://localhost:3000/api/recipe/allRecetas").then(function (response) {
    return response.json();
  }).then(function (data) {
    var recetaActual = data.recetas.find(function (receta) {
      return receta.id === recetaId;
    });
    var modalHTML = "\n                <div class=\"modal fade\" id=\"editarRecetaModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"editarRecetaLabel\" aria-hidden=\"true\">\n                    <div class=\"modal-dialog\" role=\"document\">\n                        <div class=\"modal-content\">\n                            <div class=\"modal-header custom-modal-header\">\n                                <h5 class=\"modal-title\" id=\"editarRecetaLabel\">Editar Receta</h5>\n                                <button type=\"button\" class=\"close text-white\" data-dismiss=\"modal\" aria-label=\"Close\">\n                                    <span aria-hidden=\"true\">&times;</span>\n                                </button>\n                            </div>\n                            <div class=\"modal-body\">\n                                <form id=\"formEditarReceta\">\n                                    <div class=\"form-group\">\n                                        <label for=\"titulo\">T\xEDtulo de la receta</label>\n                                        <input type=\"text\" class=\"form-control\" id=\"titulo\" value=\"".concat(recetaActual.titulo, "\" required>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <label for=\"categoria\">Categor\xEDa</label>\n                                        <select class=\"form-control\" id=\"categoria\">\n                                            <option ").concat(recetaActual.categoria === 'Entradas' ? 'selected' : '', ">Entradas</option>\n                                            <option ").concat(recetaActual.categoria === 'Platos principales' ? 'selected' : '', ">Platos principales</option>\n                                            <option ").concat(recetaActual.categoria === 'Complementos' ? 'selected' : '', ">Complementos</option>\n                                            <option ").concat(recetaActual.categoria === 'Bebidas' ? 'selected' : '', ">Bebidas</option>\n                                            <option ").concat(recetaActual.categoria === 'Postres' ? 'selected' : '', ">Postres</option>\n                                        </select>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <label for=\"descripcion\">Descripci\xF3n</label>\n                                        <textarea class=\"form-control\" id=\"descripcion\" rows=\"4\" required>").concat(recetaActual.descripcion, "</textarea>\n                                    </div>\n                                </form>\n                            </div>\n                            <div class=\"modal-footer\">\n                                <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancelar</button>\n                                <button type=\"button\" class=\"btn custom-save-btn\" id=\"guardarCambios\">Guardar cambios</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ");
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    $('#editarRecetaModal').modal('show');
    document.getElementById('guardarCambios').addEventListener('click', function () {
      var titulo = document.getElementById('titulo').value.trim();
      var categoria = document.getElementById('categoria').value;
      var descripcion = document.getElementById('descripcion').value.trim();
      if (!titulo || !categoria || !descripcion) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Todos los campos son obligatorios.'
        });
        return;
      }
      fetch("http://localhost:3000/api/recipe/update/".concat(recetaId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombreReceta: titulo,
          categoria: categoria,
          descripcion: descripcion
        })
      }).then(function (response) {
        if (!response.ok) throw new Error('Error al actualizar la receta');
        return response.json();
      }).then(function (data) {
        Swal.fire({
          icon: 'success',
          title: 'Receta actualizada',
          text: data.mensaje
        });
        $('#editarRecetaModal').modal('hide');
        cargarRecetas();
      })["catch"](function (error) {
        //console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la receta.'
        });
      });
    });
    $('#editarRecetaModal').on('hidden.bs.modal', function () {
      this.remove();
    });
  })["catch"](function (error) {
    //console.error('Error al cargar receta para editar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar la receta para editar.'
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
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.isConfirmed) {
      fetch("http://localhost:3000/api/recipe/delete/".concat(recetaId), {
        method: 'DELETE'
      }).then(function (response) {
        if (!response.ok) {
          throw new Error('Error al eliminar la receta');
        }
        return response.json();
      }).then(function (data) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminada',
          text: data.mensaje || 'La receta ha sido eliminada correctamente.'
        });
        cargarRecetas();
      })["catch"](function (error) {
        //console.error('Error al eliminar la receta:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la receta.'
        });
      });
    }
  });
}

// cargar recetas al cargar la página
document.addEventListener('DOMContentLoaded', cargarRecetas);