document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://www.amoamel.com/web/api/users/register";

    const form = document.querySelector("form");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = form.Nombre.value.trim();
        const lastName = form.Apellido.value.trim();
        const username = form.Username.value.trim();
        const email = form.Email.value.trim();
        const password = form.Password.value.trim();
        const confirmPassword = form.ConfirmPassword.value.trim();
        const category = form.Categoria.value;

        if (password !== confirmPassword) {
            showError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            showError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const registerData = { name, lastName, username, email, password, category };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                window.location.href = "index.html";
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
        errorMessage.style.display = "block";
    };
});