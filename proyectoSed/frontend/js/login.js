// clase auth para manejar la lógica de autenticación
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
                const currentTime = Date.now(); // hora actual en milisegundos
                localStorage.setItem('token', data.token); // guardar el token en localstorage
                localStorage.setItem('loginTime', currentTime); // guardar hora de login
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
        showLoginMessage("Por favor, completa todos los campos.", "danger");
        return;
    }

    const auth = new Auth();
    const responseStatus = await auth.logIn(correo, contrasena);

    if (responseStatus === 200) {
        localStorage.setItem('correo', correo); 
        showLoginMessage("Inicio de sesión exitoso.", "success");
        setTimeout(() => {
            const prueba = (token) => {
                const arrayToken = token.split('.');
                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                return tokenPayload
            }
            const token = localStorage.getItem('token');
            if (prueba(token).roles.includes("super_admin")) {
                console.log(prueba);
                window.location.href = "dashboardSuperAdmin.html";
                return 
            }
            if (prueba(token).roles.includes("admin")) {
                window.location.href = "dashboardAdmin.html";
                return
            }
            window.location.href = "index.html";
        }, 1500);
    } else if (responseStatus === 401) {
        showLoginMessage("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.", "danger");
    } else {
        showLoginMessage("Error en el servidor. Inténtalo más tarde.", "danger");
    }
}

// al cargar la página, eliminar el token previo
window.onload = () => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (token && loginTime) {
        const currentTime = Date.now();
        const timeDifference = currentTime - loginTime;
        const hourInMilliseconds = 60 * 60 * 1000; // una hora en milisegundos

        if (timeDifference > hourInMilliseconds) {
            localStorage.removeItem('token'); // eliminar token si ha pasado más de una hora
            localStorage.removeItem('loginTime'); // eliminar hora de login
            window.location.href = "landingpage.html"; // redirigir a login
        }
    }
};

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.className = `alert alert-${type}`;
    loginMessage.textContent = message;
    loginMessage.classList.remove('d-none');

    // ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        loginMessage.classList.add('d-none');
    }, 3000);
}

function logOut() {
    localStorage.removeItem('token'); // eliminar el token
    localStorage.removeItem('loginTime'); // eliminar la hora de login
    window.location.href = "landingpage.html"; // redirigir a la página de login
}

