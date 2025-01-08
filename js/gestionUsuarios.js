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

        editButton.addEventListener("click", () => editUser(user));
        deleteButton.addEventListener("click", () => deleteUser(user));
    };

    //Funcion pa editar usuario
    const editUser = (user) => {
        // Verifica si ya existe un modal abierto
        const existingModal = document.getElementById("edit-modal");
        
        // Si ya existe un modal, se cierra antes de crear uno nuevo
        if (existingModal) {
            existingModal.remove(); // elimina el modal anterior
        }

        // Se crea el HTML del modal dinámicamente
        const modalHTML = `
            <div id="edit-modal" class="modal">
                <div class="modal-content">
                    <h2>Editar Usuario</h2>
                    <form id="edit-form">
                        <label for="edit-name">Nombre:</label>
                        <input type="text" id="edit-name" name="name" required value="${user.name}">

                        <label for="edit-lastname">Apellido:</label>
                        <input type="text" id="edit-lastname" name="lastname" required value="${user.lastName}">

                        <label for="edit-password">Contraseña:</label>
                        <input type="password" id="edit-password" name="password">

                        <div class="modal-buttons">
                            <button type="submit" class="save-btn">Guardar cambios</button>
                            <button type="button" class="cancel-btn">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Agrega el HTML del modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Obtiene los elementos del modal
        const editModal = document.getElementById("edit-modal");
        const cancelButton = document.querySelector(".cancel-btn");
        const form = document.getElementById("edit-form");

        // Asigna el ID del usuario al formulario (si es necesario para futuras acciones)
        const editName = document.getElementById("edit-name");
        editName.dataset.userId = user._id;

        // Mostrar el modal
        editModal.style.display = "flex";

        // Función para cerrar el modal
        const closeModal = () => {
            document.body.removeChild(editModal); // wlimina el modal del DOM
        };

        // Evento para cerrar el modal al hacer clic en "Cancelar"
        cancelButton.addEventListener("click", closeModal);

        // Evento para manejar el formulario
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); 
    
            // Se obtiene los valores del formulario
            const updatedName = document.getElementById("edit-name").value;
            const updatedLastName = document.getElementById("edit-lastname").value;
            const updatedPassword = document.getElementById("edit-password").value;
    
            // Se crea el objeto con los datos actualizados
            const updatedUser = {
                name: updatedName,
                lastName: updatedLastName,
                password: updatedPassword || undefined, 
            };
    
            // Hace la solicitud PUT para actualizar los datos del usuario
            try {
                // para probar
                // console.log("API_URL:", API_URL);
                // console.log("user._id:", user._id);
                // console.log("URL final:", `${API_URL}/update/${user._id}`);

                
                const response = await fetch(`${API_URL}`, {
                    method: "PUT", 
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify(updatedUser),
                });
    
                if (response.ok) {
                    // Mostrar mensaje de exito (por ahora)
                    alert("Usuario actualizado correctamente."); //pa probar
                    closeModal(); 
                    // 
                } else {
                    const error = await response.json();
                    showError(`Error: ${error.message}`);       
                }
            } catch (err) {
                console.error("Error en la solicitud:", err);  
                showError("No se pudo actualizar el usuario. Intenta de nuevo.");
            }
        });
    };




    //Funcion pa eliminar usuario
    const deleteUser = (user) => {
        // Verifica si ya existe un modal abierto
        const existingModal = document.getElementById("delete-modal");

        // Si ya existe un modal, se cierra antes de crear uno nuevo
        if (existingModal) {
            existingModal.remove(); // elimina el modal anterior
        }

        // Crear el HTML del modal dinámicamente
        const modalHTML = `
            <div id="delete-modal" class="modal">
                <div class="modal-content">
                    <h2>Eliminar Usuario <span>⚠️</span></h2>
                    <p>¿Estás seguro de que deseas eliminar a <strong>${user.name} ${user.lastName}</strong>?</p>
                    <div class="modal-buttons">
                        <button id="confirm-delete-btn" class="delete-btn">Eliminar</button>
                        <button id="cancel-delete-btn" class="cancel-btn">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        // Agregar el HTML del modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Obtener los elementos del modal
        const deleteModal = document.getElementById("delete-modal");
        const confirmDeleteButton = document.getElementById("confirm-delete-btn");
        const cancelDeleteButton = document.getElementById("cancel-delete-btn");

        // Mostrar el modal
        deleteModal.style.display = "flex";

        // Función para cerrar el modal
        const closeModal = () => {
            document.body.removeChild(deleteModal); // elimina el modal del DOM
        };

        // Evento para cerrar el modal al hacer clic en "Cancelar"
        cancelDeleteButton.addEventListener("click", closeModal);

        // Evento para manejar la confirmación de eliminación
        confirmDeleteButton.addEventListener("click", async () => {
            try {
                // Se verifica los valores de API_URL y la URL completa
                console.log("API_URL:", API_URL);
                console.log("URL final:", `${API_URL}?userId=${user._id}`);

                // Se hace la solicitud DELETE para eliminar el usuario
                const response = await fetch(`${API_URL}?userId=${user._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    },
                });

                if (response.ok) {
                    // Mostrar mensaje de exito (solo por ahora)
                    alert("Usuario eliminado correctamente."); // pa probar
                    closeModal();
                    // 
                } else {
                    const error = await response.json();
                    showError(`Error: ${error.message}`);
                }
            } catch (err) {
                console.error("Error en la solicitud:", err); 
                showError("No se pudo eliminar el usuario. Intenta de nuevo.");
            }
        });
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
