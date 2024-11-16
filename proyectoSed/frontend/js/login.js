// clase Auth para manejar la lógica de autenticación
class Auth {
    async logIn(correo, contrasena) {
        try {
            const response = await fetch('http://localhost:3000/logIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // guardar el token en localstorage
                return response.status; // devolver el código de estado
            } else {
                return response.status; // manejar errores
            }
        } catch (error) {
            console.error("Error en la solicitud de inicio de sesión:", error);
            return 500; // código para error del servidor
        }
    }
}

// función principal para manejar el login
async function handleLogin(event) {
    event.preventDefault(); // prevenir el comportamiento por defecto

    // obtener los valores del formulario
    const correo = document.getElementById('correoLogin').value;
    const contrasena = document.getElementById('contrasenaLogin').value;

    if (!correo || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const auth = new Auth();
    const responseStatus = await auth.logIn(correo, contrasena);

    if (responseStatus === 200) {
        localStorage.setItem('correo', correo); 
        showLoginMessage("Inicio de sesión exitoso.", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } else {
        alert("Error al iniciar sesión. Verifica tus datos.");
    }
}

// al cargar la página, eliminar el token previo
window.onload = () => {
    localStorage.removeItem('token');
};

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.className = `alert alert-${type}`;
    loginMessage.textContent = message;
    loginMessage.classList.remove('d-none');

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        loginMessage.classList.add('d-none');
    }, 3000);
}

