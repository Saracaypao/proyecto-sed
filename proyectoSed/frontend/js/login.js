
function handleLogin(event) {
    event.preventDefault(); // previniendo el envío del formulario
    // lógica adicional para validar el inicio de sesión si es necesario
    
    // redirigir a index.html
    window.location.href = "index.html";
}

function showRegisterModal() {
    $('#loginModal').modal('hide'); // cierra el modal de inicio de sesión
    $('#registerModal').modal('show'); // muestra el modal de registro
}

function showSignUpModal() {
    $('#registerModal').modal('hide'); // cierra el modal de registro
    $('#loginModal').modal('show'); // muestra el modal de inicio de sesión
}

