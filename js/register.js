document.addEventListener("DOMContentLoaded", () => {
    // Endpoint del backend
    const API_URL = "http://localhost:3000/api/register"; 

    // Selección del formulario
    const form = document.querySelector("#registerForm");
    const errorMessage = document.getElementById("error-message");

    // Manejar el envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        // Obtener valores de los campos
        const nombre = form.Nombre.value.trim();
        const apellido = form.Apellido.value.trim();
        const username = form.username.value.trim();
        const email = form.user_email.value.trim();
        const password = form.password.value.trim();
        const confirmPassword = form.confirmPassword.value.trim();
        const rol = form.rol.value; 

        // Validaciones
        if (!nombre || !apellido || !username || !email || !password || !confirmPassword || !rol) {
            showError("Por favor, completa todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            showError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Crear el objeto con los datos del formulario
        const registerData = { nombre, apellido, username, email, password, rol };

        try {
            // Enviar datos al backend mediante fetch
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Cuenta creada exitosamente!");
                window.location.href = "/login";  
            } else if (response.status === 400) {
                showError("Datos inválidos. Verifica tu información.");
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

    // Función para mostrar mensajes de error
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    };
});
