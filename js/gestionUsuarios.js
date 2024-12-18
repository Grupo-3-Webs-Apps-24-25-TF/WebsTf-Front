document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://www.amoamel.com/web/api/users/myUser";

    const userName = document.getElementById("username");

    const btnSeacrhUser = document.getElementById("searchUser");

    btnSearchUser.addEventListener('click', async function() {
        const token = localStorage.getItem("token");

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
               const user = result.user;                           // Accede al usuario en la respuesta

               console.log(`Usuario: ${user.name}`);
           } else {
               const error = await response.json();
               showError(`Error: ${error.message}`);
           }
       } catch (err) {
           showError("No se pudo conectar al servidor. Verifica tu conexión.");
       }
    });
});