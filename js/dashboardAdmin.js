document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://www.amoamel.com/web/api/users/myUser";

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (response.ok) {
            const result = await response.json();

            const welcomeMessage = document.querySelector('h2');
            welcomeMessage.textContent = `¡Bienvenido de nuevo, ${result.user.name}!`;

            const headerSpan = document.querySelector('.header-right span');
            headerSpan.textContent = `Hola, ${result.user.name}`;
        } else {
            console.error(`Error ${error.message}:`);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }

    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem('token');

        window.location.href = "index.html";
    });
});