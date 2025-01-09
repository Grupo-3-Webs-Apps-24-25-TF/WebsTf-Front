document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://www.amoamel.com/web/api/users";

    // Obtén el token del usuario desde localStorage
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    // Mostrar el nombre almacenado en localStorage (si existe)
    const name = localStorage.getItem("name");
    if (name) {
        updateWelcomeMessage(name);
    }

    async function getUserData() {
        try {
            //realiza la solicitud a la API para obtener el usuario * IMPORTANTEee **
            const response = await fetch(API_URL + "/getByUsername?username=" + username,  {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("User data:", result);

                // Actualiza el saludo en el dashboard
                const welcomeMessage = document.querySelector('h2');
                welcomeMessage.textContent = `¡Bienvenido de nuevo, ${result.user.name}!`;

                // Actualiza el saludo en la barra superior
                const headerSpan = document.querySelector('.header-right span');
                headerSpan.textContent = `Hola, ${result.user.name}`;

                // Lo guarda para los demás archivos
                localStorage.setItem("name", result.user.name);
            } else {
                console.error(`Error ${response.status}:`, response.statusText);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    }
    
    getUserData();
});

function updateWelcomeMessage(name) {
    const welcomeMessage = document.querySelector('h2');
    welcomeMessage.textContent = `¡Bienvenido de nuevo, ${name}!`;

    const headerSpan = document.querySelector('.header-right span');
    headerSpan.textContent = `Hola, ${name}`;
}