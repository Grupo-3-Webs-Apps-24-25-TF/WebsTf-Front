document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://www.amoamel.com/web/api/users/login";

    const form = document.querySelector("form");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = form.username.value.trim();
        const password = form.password.value.trim();

        const loginData = { username, password };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const result = await response.json();

                localStorage.setItem("token", result.token);
                localStorage.setItem("role", result.role);

                if (result.role == "Usuario") {
                    window.location.href = "dashboardUser.html";
                } else {
                    window.location.href = "dashboardAdmin.html";
                }
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