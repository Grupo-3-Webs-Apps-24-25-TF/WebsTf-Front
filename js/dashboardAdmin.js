document.addEventListener("DOMContentLoaded", () => {
    // Obtén el nombre del usuario desde localStorage
    const userName = localStorage.getItem("userName");

    // Si no hay nombre, redirigir al inicio de sesión
    if (!userName) {
        window.location.href = "index.html"; // Redirige si no está logueado
        return;
    }

    // Actualiza el saludo en el dashboard
    const welcomeMessage = document.querySelector('h2');
    welcomeMessage.textContent = `¡Bienvenido de nuevo, ${userName}!`;

    // Actualiza el saludo en la barra superior
    const headerSpan = document.querySelector('.header-right span');
    headerSpan.textContent = `Hola, ${userName}`;
});
