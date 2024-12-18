// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // URL de la API para iniciar sesión
    const API_URL = "https://www.amoamel.com/web/api/users/login";

    // Obtiene el formulario de la página y el contenedor para mensajes de error
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("error-message");

    // Escucha el evento de "submit" del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Obtiene los valores ingresados por el usuario, eliminando espacios en blanco
        const username = form.username.value.trim();
        const password = form.password.value.trim();

        // Crea un objeto con los datos de inicio de sesión
        const loginData = { username, password };

        try {
             // Realiza una solicitud a la API con los datos de inicio de sesión
            const response = await fetch(API_URL, {
                method: "POST",                                     // Tipo de solicitud (POST para enviar datos)
                headers: { "Content-Type": "application/json" },    // Especifica que el cuerpo es JSON
                body: JSON.stringify(loginData),                    // Convierte los datos de inicio de sesión a formato JSON
            });

             // Verifica si la respuesta de la API es exitosa
            if (response.ok) {
                const result = await response.json();               // Convierte la respuesta a un objeto JSON
                // Almacena el rol y el token en el almacenamiento local del navegador (es como sesión de PHP)
                localStorage.setItem("role", result.role);
                localStorage.setItem("token", result.token);
                // Redirige al usuario a la página de registro
                window.location.href = "dashboardAdmin.html";
            } else {
                const error = await response.json();
                showError(`Error: ${error.message}`);
            }
        } catch (err) {
            showError("No se pudo conectar al servidor. Verifica tu conexión.");
        }
    });

    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";                       // Asegura que el mensaje sea visible
    };
});