document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://www.amoamel.com/web/api";

    const token = localStorage.getItem("token");
    let role;

    try {
        const response = await fetch(API_URL + "/users/myUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (response.ok) {
            const result = await response.json();
            role = result.user.role;

            const welcomeMessage = document.querySelector('h2');
            welcomeMessage.textContent = `¡Bienvenido de nuevo, ${result.user.name}!`;

            const headerSpan = document.querySelector('.header-icons span');
            headerSpan.textContent = `Hola, ${result.user.name}`;
        } else {
            console.error(`Error ${error.message}:`);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }

    const form = document.getElementById("eventForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = form.Title.value.trim();
        const description = form.Description.value.trim();
        const startTime = form.HourStarting.value;  
        const endTime = form.HourEnding.value;        
        const location = form.Location.value.trim();
        const category = form.Category.value;
        const date = form.Date.value;
        const registerLink = form.RegisterLink.value.trim();
        const imageFile = form.Image.files[0];

        if (startTime && endTime && startTime >= endTime) {
            alert("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        try {
            const eventData = {
                title,
                description,
                hourStarting: startTime, 
                hourEnding: endTime,     
                location,
                category,
                date,
                registerLink
            };

            const createEventResponse = await fetch(role == "Administrador" ? API_URL + "/events/post-admin" : API_URL + "/events/post-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify(eventData),
            });

            if (createEventResponse.ok) {
                const createdEvent = await createEventResponse.json();
                const eventId = createdEvent.event._id;

                if (imageFile) {
                    const formData = new FormData();
                    formData.append("image", imageFile);
                    formData.append("eventId", eventId);

                    const uploadImageResponse = await fetch(API_URL + "/events/image", {
                        method: "PUT",
                        headers: {
                            "Authorization": token,
                        },
                        body: formData,
                    });

                    if (!uploadImageResponse.ok) {
                        const error = await uploadImageResponse.text();
                        alert(`Error al subir la imagen: ${error}`);
                        return;
                    }
                }

                alert("Evento creado y, si se seleccionó, imagen subida con éxito.");
                form.reset();
            } else {
                const error = await createEventResponse.json();
                console.error("Error al crear el evento:", error);
                alert(`Error al crear el evento: ${error.message}`);
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar al servidor. Verifica tu conexión.");
        }
    });

    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem('token');

        window.location.href = "index.html";
    });
});
