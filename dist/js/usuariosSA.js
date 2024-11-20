"use strict";

fetch('http://localhost:3000/api/user/allUsers').then(function (response) {
  console.log('Respuesta del servidor:', response); // verifica la respuesta completa
  return response.json();
}).then(function (data) {
  console.log('Datos recibidos:', data); // verifica los datos que estamos recibiendo
  // verificar si la respuesta contiene usuarios
  if (data.usuarios && Array.isArray(data.usuarios)) {
    var container = document.getElementById('user-cards-container');
    container.innerHTML = '';
    data.usuarios.forEach(function (user) {
      var userCard = document.createElement('div');
      userCard.classList.add('col-md-4', 'mb-4');
      userCard.innerHTML = "\n                    <div class=\"card text-center\" id=\"user-".concat(user._id, "\">\n                        <div class=\"card-body\">\n                            <h5 class=\"card-title\">").concat(user.nombre, "</h5>\n                            <p class=\"card-text\">").concat(user.correo, "</p>\n                            <span class=\"badge badge-warning\">").concat(user.roles[0] || 'Sin rol', "</span>\n                            <div class=\"mt-3\">\n                                <button class=\"btn btn-primary btn-action\" data-toggle=\"modal\" data-target=\"#editUserModal\" onclick=\"editUser('").concat(user._id, "')\">Editar</button>\n                                <button class=\"btn btn-danger btn-action\" onclick=\"confirmDelete('").concat(user._id, "')\">Eliminar</button>\n                            </div>\n                        </div>\n                    </div>\n                ");
      container.appendChild(userCard);
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error al cargar usuarios',
      text: 'No se pudo cargar la lista de usuarios.'
    });
  }
})["catch"](function (error) {
  console.error('Error:', error);
  Swal.fire({
    icon: 'error',
    title: 'Error de conexión',
    text: 'Hubo un problema al intentar conectar con el servidor.'
  });
});
function confirmDelete(userId) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(function (result) {
    if (result.isConfirmed) {
      deleteUser(userId);
    }
  });
}
function deleteUser(userId) {
  fetch("http://localhost:3000/api/user/deleteUser/".concat(userId), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer ".concat(localStorage.getItem('token'))
    }
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Error al eliminar el usuario');
    }
    return response.json();
  }).then(function (data) {
    Swal.fire({
      icon: 'success',
      title: 'Usuario eliminado',
      text: data.mensaje
    });
    var userCard = document.getElementById("user-".concat(userId));
    if (userCard) {
      userCard.remove();
    }
    reloadUserCards();
  })["catch"](function (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el usuario. Por favor, intenta nuevamente.' //mostrar un mensaje en caso que se haya querido eliminar un superadmin
    });
  });
}
function submitNewUser(event) {
  event.preventDefault();

  // obteniendo los valores del formulario
  var nombre = document.getElementById('addUserName').value.trim();
  var correo = document.getElementById('addUserEmail').value.trim();
  var contrasena = document.getElementById('addUserPassword').value;
  var confirmarContrasena = document.getElementById('addUserConfirmPassword').value;
  var rol = document.getElementById('addUserRole').value === 'Administrador' ? 'admin' : 'user';

  // validando campos obligatorios
  if (!nombre || !correo || !contrasena || !confirmarContrasena) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son obligatorios.'
    });
    return;
  }

  // validando que las contraseñas coincidan
  if (contrasena !== confirmarContrasena) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden.'
    });
    return;
  }

  // enviando los datos al backend
  fetch('http://localhost:3000/api/user/newUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer ".concat(localStorage.getItem('token'))
    },
    body: JSON.stringify({
      nombre: nombre,
      correo: correo,
      contrasena: contrasena,
      confirmarContrasena: confirmarContrasena,
      rol: rol
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw err;
      });
    }
    return response.json();
  }).then(function (data) {
    Swal.fire({
      icon: 'success',
      title: 'Usuario agregado',
      text: data.mensaje
    });

    // verificar si el backend devuelve el usuario creado
    if (data.usuario) {
      var container = document.getElementById('user-cards-container');
      var userCard = document.createElement('div');
      userCard.classList.add('col-md-4', 'mb-4');
      userCard.innerHTML = "\n                        <div class=\"card text-center\" id=\"user-".concat(data.usuario._id, "\">\n                            <div class=\"card-body\">\n                                <h5 class=\"card-title\">").concat(data.usuario.nombre, "</h5>\n                                <p class=\"card-text\">").concat(data.usuario.correo, "</p>\n                                <span class=\"badge badge-warning\">").concat(data.usuario.roles[0], "</span>\n                                <div class=\"mt-3\">\n                                    <button class=\"btn btn-primary btn-action\" onclick=\"editUser('").concat(data.usuario._id, "')\">Editar</button>\n                                    <button class=\"btn btn-danger btn-action\" onclick=\"confirmDelete('").concat(data.usuario._id, "')\">Eliminar</button>\n                                </div>\n                            </div>\n                        </div>\n                    ");
      container.appendChild(userCard);
    }
    reloadUserCards();
    document.getElementById('addUserForm').reset();
    $('#addUserModal').modal('hide');
  })["catch"](function (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.error || 'No se pudo agregar el usuario.'
    });
  });
}
function editUser(userId) {
  var userCard = document.querySelector("#user-".concat(userId));
  var nombre = userCard.querySelector('.card-title').innerText;
  var correo = userCard.querySelector('.card-text').innerText;
  var rol = userCard.querySelector('.badge').innerText;
  document.getElementById('editUserName').value = nombre;
  document.getElementById('editUserEmail').value = correo;
  document.getElementById('editUserRole').value = rol;

  // guardar el id del usuario como atributo en el boton de guardar cambios
  var saveButton = document.querySelector('#editUserModal .btn-primary');
  saveButton.setAttribute('data-user-id', userId);
  $('#editUserModal').modal('show');
}
function submitEditUser(event) {
  event.preventDefault();

  // obteniendo los datos del formulario
  var userId = document.querySelector('#editUserModal .btn-primary').getAttribute('data-user-id');
  var nombre = document.getElementById('editUserName').value.trim();
  var correo = document.getElementById('editUserEmail').value.trim();
  var rol = document.getElementById('editUserRole').value;

  // Validando los campos
  if (!nombre || !correo) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Todos los campos son obligatorios.'
    });
    return;
  }

  // enviando los datos al backend
  fetch("http://localhost:3000/api/user/editUser/".concat(userId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer ".concat(localStorage.getItem('token'))
    },
    body: JSON.stringify({
      nombre: nombre,
      correo: correo,
      rol: rol
    })
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (err) {
        throw err;
      });
    }
    return response.json();
  }).then(function (data) {
    Swal.fire({
      icon: 'success',
      title: 'Usuario editado',
      text: data.mensaje
    });
    var userCard = document.querySelector("#user-".concat(userId));
    userCard.querySelector('.card-title').innerText = nombre;
    userCard.querySelector('.card-text').innerText = correo;
    userCard.querySelector('.badge').innerText = rol;
    reloadUserCards();
    $('#editUserModal').modal('hide');
  })["catch"](function (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.error || 'No se pudo editar el usuario.'
    });
  });
}
function reloadUserCards() {
  fetch('http://localhost:3000/api/user/allUsers').then(function (response) {
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios.');
    }
    return response.json();
  }).then(function (data) {
    var container = document.getElementById('user-cards-container');
    container.innerHTML = ''; // limpiar las tarjetas existentes

    // verificar si la respuesta contiene usuarios
    if (data.usuarios && Array.isArray(data.usuarios)) {
      data.usuarios.forEach(function (user) {
        var userCard = document.createElement('div');
        userCard.classList.add('col-md-4', 'mb-4');
        userCard.innerHTML = "\n                            <div class=\"card text-center\" id=\"user-".concat(user._id, "\">\n                                <div class=\"card-body\">\n                                    <h5 class=\"card-title\">").concat(user.nombre, "</h5>\n                                    <p class=\"card-text\">").concat(user.correo, "</p>\n                                    <span class=\"badge badge-warning\">").concat(user.roles[0] || 'Sin rol', "</span>\n                                    <div class=\"mt-3\">\n                                        <button class=\"btn btn-primary btn-action\" data-toggle=\"modal\" data-target=\"#editUserModal\" onclick=\"editUser('").concat(user._id, "')\">Editar</button>\n                                        <button class=\"btn btn-danger btn-action\" onclick=\"confirmDelete('").concat(user._id, "')\">Eliminar</button>\n                                    </div>\n                                </div>\n                            </div>\n                        ");
        container.appendChild(userCard);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar usuarios',
        text: 'No se pudo cargar la lista de usuarios.'
      });
    }
  })["catch"](function (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Hubo un problema al intentar conectar con el servidor.'
    });
  });
}