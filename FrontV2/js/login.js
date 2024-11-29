

document.addEventListener("DOMContentLoaded", () => {
    // Endpoint del backend
    const API_URL = "http://localhost:3000/api/login"; 

    // Selección del formulario y el botón de login
    const form = document.querySelector("form");
    const togglePassword = document.getElementById("toggle-password");
    const passwordField = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    // Manejar la visualización de la contraseña
    togglePassword.addEventListener("change", () => {
        passwordField.type = togglePassword.checked ? "text" : "password";
    });

    // Manejar el envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Obtener valores de los campos
        const email = form.user_email.value.trim();
        const password = form.password.value.trim();

        // Validaciones
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        if (password.length < 6) {
            showError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Crear el objeto con los datos del formulario
        const loginData = { email, password };

        try {
            // Enviar datos al backend mediante fetch
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });


            if (response.ok) {
                const result = await response.json();
                alert("Inicio de sesión exitoso!");
                window.location.href = "/dashboard";
            } else if (response.status === 401) {
                showError("Credenciales inválidas. Verifica tu email y contraseña.");
            } else if (response.status === 500) {
                showError("Error del servidor. Inténtalo más tarde.");
            } else {
                const error = await response.json();
                showError(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            showError("No se pudo conectar al servidor. Verifica tu conexión.");
        }
    });


    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    };
});
