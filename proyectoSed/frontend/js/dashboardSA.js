// funcion para obtener todos los usuarios desde el backend y contar el total
const obtenerTotalUsuarios = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/user/allUsers');
        const data = await response.json();
        if (response.ok) {
            // contar el total de usuarios
            const totalUsuarios = data.usuarios.length;
            // actualizar el contenido del card con el total de usuarios
            document.getElementById('totalUsuarios').innerText = totalUsuarios;
        } else {
            console.error('Error al obtener los usuarios', data);
        }
    } catch (error) {
        console.error('Error en la solicitud', error);
    }
};

// llamar a la funcion cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerTotalUsuarios(); 
});

// funcion para obtener todas las recetas y calcular el total 
const obtenerTotalRecetas = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/recipe/allRecetas'); 
        const data = await response.json();
        if (response.ok) {
            // contando el total de recetas 
            const totalRecetas = data.recetas.length; // El total de recetas es la longitud del array 'recetas'
            
            // actualizando el contenido de la tarjeta con el total de recetas
            document.getElementById('totalRecetas').innerText = totalRecetas;
        } else {
            console.error('Error al obtener las recetas', data);
        }
    } catch (error) {
        console.error('Error en la solicitud', error);
    }
};

// se llama a la funcion cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerTotalRecetas(); 
});
