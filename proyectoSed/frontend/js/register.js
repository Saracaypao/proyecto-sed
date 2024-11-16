
// función para manejar el envío del formulario de registro
function handleRegister(event) {
event.preventDefault();  // Prevenir la acción por defecto del formulario (recarga de página)

const nombre = document.getElementById('nombre').value;
const correo = document.getElementById('correoRegister').value;
const contrasena = document.getElementById('contrasenaRegister').value;
const confirmarContrasena = document.getElementById('confirmarContrasena').value;

// validar si las contraseñas coinciden
if (contrasena !== confirmarContrasena) {
    console.log('Las contraseñas no coinciden.');
    alert('Las contraseñas no coinciden.');
    return;
}

// enviar los datos al backend
fetch('http://localhost:3000/api/user/newUser', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, correo, contrasena, confirmarContrasena })
})
.then(response => response.json())
.then(data => {
    console.log('Respuesta recibida del backend:', data);
    const messageElement = document.getElementById('registerMessage');
    if (data.mensaje) {
        messageElement.innerHTML = `<div class="alert alert-success">${data.mensaje}</div>`;
        // vaciar los campos del formulario
        document.getElementById('nombre').value = '';
        document.getElementById('correoRegister').value = '';
        document.getElementById('contrasenaRegister').value = '';
        document.getElementById('confirmarContrasena').value = '';
    } else {
        messageElement.innerHTML = `<div class="alert alert-danger">Error al registrar el usuario</div>`;
    }
})
.catch(error => {
    console.error('Error al registrar el usuario:', error);
});
}


