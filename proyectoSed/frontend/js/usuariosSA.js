fetch('http://localhost:3000/api/user/allUsers')
    .then(response => {
        console.log('Respuesta del servidor:', response); // Verifica la respuesta completa
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data); // Verifica los datos que recibes
        // Verificar si la respuesta contiene usuarios
        if (data.usuarios && Array.isArray(data.usuarios)) {
            const container = document.getElementById('user-cards-container');
            container.innerHTML = ''; // Limpiar las tarjetas existentes

            // Iterar sobre los usuarios y crear las tarjetas
            data.usuarios.forEach(user => {
                const userCard = document.createElement('div');
                userCard.classList.add('col-md-4', 'mb-4');
                userCard.innerHTML = `
                    <div class="card text-center" id="user-${user._id}">
                        <div class="card-body">
                            <h5 class="card-title">${user.nombre}</h5>
                            <p class="card-text">${user.correo}</p>
                            <span class="badge badge-warning">${user.roles[0] || 'Sin rol'}</span>
                            <div class="mt-3">
                                <button class="btn btn-primary btn-action" data-toggle="modal" data-target="#editUserModal" onclick="editUser('${user._id}')">Editar</button>
                                <button class="btn btn-danger btn-action" onclick="confirmDelete('${user._id}')">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(userCard);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar usuarios',
                text: 'No se pudo cargar la lista de usuarios.',
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Hubo un problema al intentar conectar con el servidor.',
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
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(userId); // Llamar a la función para eliminar el usuario
            }
        });
    }
    
    function deleteUser(userId) {
        fetch(`http://localhost:3000/api/user/deleteUser/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Agregar el token si usas autenticación basada en tokens
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: data.mensaje
            });
    
            // Eliminar la tarjeta del usuario en la interfaz
            const userCard = document.getElementById(`user-${userId}`);
            if (userCard) {
                userCard.remove();
            }
            reloadUserCards();
        })
        .catch(error => {
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
    
        // Obtener los valores del formulario
        const nombre = document.getElementById('addUserName').value.trim();
        const correo = document.getElementById('addUserEmail').value.trim();
        const contrasena = document.getElementById('addUserPassword').value;
        const confirmarContrasena = document.getElementById('addUserConfirmPassword').value;
        const rol = document.getElementById('addUserRole').value === 'Administrador' ? 'admin' : 'user';
    
        // Validar campos obligatorios
        if (!nombre || !correo || !contrasena || !confirmarContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son obligatorios.',
            });
            return;
        }
    
        // Validar que las contraseñas coincidan
        if (contrasena !== confirmarContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
            });
            return;
        }
    
        // Enviar los datos al backend
        fetch('http://localhost:3000/api/user/newUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                nombre,
                correo,
                contrasena,
                confirmarContrasena,
                rol,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario agregado',
                    text: data.mensaje,
                });
    
                // Verificar si el backend devuelve el usuario creado
                if (data.usuario) {
                    const container = document.getElementById('user-cards-container');
                    const userCard = document.createElement('div');
                    userCard.classList.add('col-md-4', 'mb-4');
                    userCard.innerHTML = `
                        <div class="card text-center" id="user-${data.usuario._id}">
                            <div class="card-body">
                                <h5 class="card-title">${data.usuario.nombre}</h5>
                                <p class="card-text">${data.usuario.correo}</p>
                                <span class="badge badge-warning">${data.usuario.roles[0]}</span>
                                <div class="mt-3">
                                    <button class="btn btn-primary btn-action" onclick="editUser('${data.usuario._id}')">Editar</button>
                                    <button class="btn btn-danger btn-action" onclick="confirmDelete('${data.usuario._id}')">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(userCard);
                }
    
                reloadUserCards();

                // Limpiar el formulario y cerrar el modal
                document.getElementById('addUserForm').reset();
                $('#addUserModal').modal('hide');
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error || 'No se pudo agregar el usuario.',
                });
            });
    }

    function editUser(userId) {
        // Obtener los datos del usuario desde el DOM o hacer una solicitud al backend
        const userCard = document.querySelector(`#user-${userId}`);
        const nombre = userCard.querySelector('.card-title').innerText;
        const correo = userCard.querySelector('.card-text').innerText;
        const rol = userCard.querySelector('.badge').innerText;
    
        // Llenar el modal con los datos del usuario
        document.getElementById('editUserName').value = nombre;
        document.getElementById('editUserEmail').value = correo;
        document.getElementById('editUserRole').value = rol;
    
        // Guardar el ID del usuario como atributo en el botón de guardar cambios
        const saveButton = document.querySelector('#editUserModal .btn-primary');
        saveButton.setAttribute('data-user-id', userId);
    
        // Mostrar el modal
        $('#editUserModal').modal('show');
    }

    function submitEditUser(event) {
        event.preventDefault();
    
        // Obtener los datos del formulario
        const userId = document.querySelector('#editUserModal .btn-primary').getAttribute('data-user-id');
        const nombre = document.getElementById('editUserName').value.trim();
        const correo = document.getElementById('editUserEmail').value.trim();
        const rol = document.getElementById('editUserRole').value;
    
        // Validar los campos
        if (!nombre || !correo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son obligatorios.',
            });
            return;
        }
    
        // Enviar los datos al backend
        fetch(`http://localhost:3000/api/user/editUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ nombre, correo, rol }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario editado',
                    text: data.mensaje,
                });
    
                // Actualizar la tarjeta del usuario en el DOM
                const userCard = document.querySelector(`#user-${userId}`);
                userCard.querySelector('.card-title').innerText = nombre;
                userCard.querySelector('.card-text').innerText = correo;
                userCard.querySelector('.badge').innerText = rol;
    
                reloadUserCards();

                // Cerrar el modal
                $('#editUserModal').modal('hide');
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error || 'No se pudo editar el usuario.',
                });
            });
    }
    
    function reloadUserCards() {
        fetch('http://localhost:3000/api/user/allUsers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios.');
                }
                return response.json();
            })
            .then(data => {
                const container = document.getElementById('user-cards-container');
                container.innerHTML = ''; // Limpiar las tarjetas existentes
    
                // Verificar si la respuesta contiene usuarios
                if (data.usuarios && Array.isArray(data.usuarios)) {
                    data.usuarios.forEach(user => {
                        const userCard = document.createElement('div');
                        userCard.classList.add('col-md-4', 'mb-4');
                        userCard.innerHTML = `
                            <div class="card text-center" id="user-${user._id}">
                                <div class="card-body">
                                    <h5 class="card-title">${user.nombre}</h5>
                                    <p class="card-text">${user.correo}</p>
                                    <span class="badge badge-warning">${user.roles[0] || 'Sin rol'}</span>
                                    <div class="mt-3">
                                        <button class="btn btn-primary btn-action" data-toggle="modal" data-target="#editUserModal" onclick="editUser('${user._id}')">Editar</button>
                                        <button class="btn btn-danger btn-action" onclick="confirmDelete('${user._id}')">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        container.appendChild(userCard);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al cargar usuarios',
                        text: 'No se pudo cargar la lista de usuarios.',
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'Hubo un problema al intentar conectar con el servidor.',
                });
            });
    }
    
    