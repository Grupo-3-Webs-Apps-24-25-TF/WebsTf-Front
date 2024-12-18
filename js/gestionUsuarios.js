document.addEventListener("DOMContentLoaded", async () => {
    const API_URL_DEV = "http://localhost:3010/api/users";
    const API_URL = "https://www.amoamel.com/web/api/users";
    const token = localStorage.getItem("token");

    try {
        // Realiza una solicitud a la API con los datos de inicio de sesión
        const response = await fetch(API_URL + "/myUser", {
            method: "GET",                                     // Tipo de solicitud (POST para enviar datos)
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token
            }    // Especifica que el cuerpo es JSON
        });           
        
        // Verifica si la respuesta de la API es exitosa
        if (response.ok) {
            await response.json();               // Convierte la respuesta a un objeto JSON
        } else {
            const error = await response.json();               
            showError(`Error: ${error.message}`);
        }
    } catch (err) {
        showError("No se pudo conectar al servidor. Verifica tu conexión.");
    }

    const userName = document.getElementById("username");    
    const btnSearchUser = document.getElementById("searchUser");

    btnSearchUser.addEventListener('click', async function() {
        let usernamePrompt = userName.value;
        
        if (usernamePrompt != "") {
            try {
                // Realiza una solicitud a la API con los datos de inicio de sesión
                const response = await fetch(API_URL_DEV + "/getByUsername?username=" + usernamePrompt, {
                    method: "GET",                                     // Tipo de solicitud (POST para enviar datos)
                    headers: { 
                        "Content-Type": "application/json"
                    }    // Especifica que el cuerpo es JSON
                });           

                // Verifica si la respuesta de la API es exitosa
                if (response.ok) {
                    const result = await response.json();               // Convierte la respuesta a un objeto JSON
                    const user = result.user;                           // Accede al usuario en la respuesta

                    console.log(`Usuario: ${user.name}`);
                } else {
                    const error = await response.json();               
                    showError(`Error: ${error.message}`);
                }
            } catch (err) {
                showError("No se pudo conectar al servidor. Verifica tu conexión.");
            }
        } else {
            showError("Ingrese un nombre para buscar");
        }
    });

    const showError = (message) => {
        console.log(message);
    };
});