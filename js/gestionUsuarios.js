document.addEventListener("DOMContentLoaded", async () => {
    const API_URL_DEV = "http://localhost:3010/api/users";
    const API_URL = "https://www.amoamel.com/web/api/users";
    const token = localStorage.getItem("token");

    //Funcion par mostrar errores
    const showError = (message) => {
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    };

    //limpia mensajes de error
    const clearError = () => {
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        }
    };

    //muestra el icono de carga
    const showLoading = () => {
        const spinner = document.getElementById("loading-spinner");
        if (spinner) spinner.style.display = "block";
    };

    //se oculta el icono de carga
    const hideLoading = () => {
        const spinner = document.getElementById("loading-spinner");
        if (spinner) spinner.style.display = "none";
    };

    //Funcion paa generar tarjeta de usuario
    const createUserCard = (user) => {
        const cardsContainer = document.getElementById("cards-container");

        //construye el HTML de la tarjeta
        const userCard = `
            <div class="card">
                <h3>${user.username}</h3>
                <p><strong>Nombre y Apellidos:</strong> ${user.name} ${user.lastName}</p>
                <p><strong>Rol:</strong> ${user.role}</p>
                <p><strong>Categoria:</strong> ${user.category}</p>
                <p><strong>Correo:</strong> ${user.email}</p>
                <div class="card-buttons">
                    <button class="edit-btn" data-user-id="${user._id}">Editar</button>
                    <button class="delete-btn" data-user-id="${user._id}">Eliminar</button>
                </div>
            </div>
        `;

        //inserta la tarjeta en el contenedor
        cardsContainer.innerHTML = userCard;

        //agrega eventos a los botones de la tarjeta
        const editButton = cardsContainer.querySelector(".edit-btn");
        const deleteButton = cardsContainer.querySelector(".delete-btn");

        editButton.addEventListener("click", () => editUser(user._id));
        deleteButton.addEventListener("click", () => deleteUser(user._id));
    };

    //Funcion pa editar usuario
    const editUser = (userId) => {
        alert(`Editar usuario con ID: ${userId}`);
        // Aquí puedes redirigir a una página de edición o mostrar un formulario modal
    };

    //Funcion pa eliminar usuario
    const deleteUser = (userId) => {
        alert(`Eliminar usuario con ID: ${userId}`);
        
    };

    //Evento pa buscar el usuario
    const userName = document.getElementById("username");
    const categorySelect = document.getElementById("Categoria");
    const btnSearchUser = document.getElementById("searchUser");

    btnSearchUser.addEventListener("click", async function () {
        const usernamePrompt = userName.value.trim();

        if (usernamePrompt) {
            clearError();
            showLoading();
            try {
                //realiza la solicitud a la API para obtener el usuario * IMPORTANTEee **
                const response = await fetch(API_URL + "/getByUsername?username=" + usernamePrompt,  {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                });

                hideLoading();

                if (response.ok) {
                    const result = await response.json();
                    console.log("Datos del usuario:", result.user); // depuracion en consola pa proabr 
                    const user = result.user;

                    if (user) {
                        createUserCard(user); // pa crear la tarjeta con los datos del usuario
                    } else {
                        showError("Usuario no encontrado.");
                    }
                } else {
                    const error = await response.json();
                    showError(`Error: ${error.message}`);
                }
            } catch (err) {
                hideLoading();
                showError("No se pudo conectar al servidor. Verifica tu conexión.");
            }
        } else {
            showError("Ingrese un nombre para buscar");
        }
    });
});
