
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
    showRegisterMessage("Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.", "danger");
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
        showRegisterMessage(data.mensaje, "success");
        // vaciar los campos del formulario
        document.getElementById('nombre').value = '';
        document.getElementById('correoRegister').value = '';
        document.getElementById('contrasenaRegister').value = '';
        document.getElementById('confirmarContrasena').value = '';
    } else {
        showRegisterMessage("Error al registrar el usuario. Inténtalo más tarde.", "danger");
    }
})
.catch(error => {
    console.error('Error al registrar el usuario:', error);
    showRegisterMessage("Error de servidor. Intenta nuevamente más tarde.", "danger");
});
}

// función para mostrar mensajes estilizados en el registro
function showRegisterMessage(message, type) {
    const registerMessage = document.getElementById('registerMessage');
    registerMessage.className = `alert alert-${type} text-center`;  // define el tipo de alerta (roja o verde)
    registerMessage.textContent = message;  // establece el mensaje
    registerMessage.classList.remove('d-none');  // muestra el mensaje

    // ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        registerMessage.classList.add('d-none');
    }, 3000);
}


