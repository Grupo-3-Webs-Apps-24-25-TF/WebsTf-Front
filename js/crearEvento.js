document.addEventListener("DOMContentLoaded", () => {
    const API_URL_USER = "https://www.amoamel.com/web/api/events/post-user";
    const API_URL_ADMIN = "https://www.amoamel.com/web/api/events/post-admin";
    const API_URL_IMAGE = "https://www.amoamel.com/web/api/events/image"; // URL para subir la imagen
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // Obtener el rol del usuario logueado
    const form = document.getElementById("eventForm");
    updateWelcomeMessage();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Valores del formulario
        const title = form.title.value.trim();
        const description = form.description.value.trim();
        const startTime = form.hourStarting.value;  
        const endTime = form.hourEnding.value;        
        const location = form.location.value.trim();
        const category = form.category.value;
        const date = form.date.value;
        const registerLink = form.registerLink.value.trim();
        const imageFile = form.image.files[0]; // Imagen seleccionada por el usuario

        console.log("Archivo de imagen seleccionado:", imageFile);

        // Validaciones básicas
        if (!title || !category || !date || !registerLink || !description || !startTime || !endTime || !location) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (startTime && endTime && startTime >= endTime) {
            alert("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        try {
            // Seleccionar la URL adecuada según el rol del usuario
            const apiUrl = userRole === "Administrador" ? API_URL_ADMIN : API_URL_USER;

            // Crear el evento (con imagen predeterminada)
            const eventData = {
                title,
                description,
                hourStarting: startTime, 
                hourEnding: endTime,     
                location,
                category,
                date,
                registerLink,
                image: "../assets/defecto.png" // Imagen predeterminada ubicada en la carpeta assets
            };

            // Agregar estado si el usuario es administrador
            if (userRole === "Administrador") {
                eventData.status = "Aprobado";
            }

            const createEventResponse = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify(eventData),
            });

            if (!createEventResponse.ok) {
                const error = await createEventResponse.json();
                console.error("Error al crear el evento:", error);
                alert(`Error al crear el evento: ${error.message}`);
                return;
            }

            const createdEvent = await createEventResponse.json();
            const eventId = createdEvent.event._id; // Obtener el ID del evento creado
            console.log("Evento creado con éxito. ID:", eventId);

            // Agregar el evento dinámicamente a la lista (si es necesario)
            addEventToList(eventData); //PARA PROBAR

            // Si se seleccionó una imagen, subirla en el segundo paso
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("eventId", eventId); // Asociar la imagen con el evento

                // Subir la imagen al evento
                const uploadImageResponse = await fetch(API_URL_IMAGE, {
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

                const imageResponse = await uploadImageResponse.json();
                const imageUrl = imageResponse.imageUrl;  
                console.log("Imagen subida con éxito:", imageUrl);
            } else {
                console.log("No se seleccionó imagen, se mantiene la imagen por defecto.");
            }

            alert("Evento creado y, si se seleccionó, imagen subida con éxito.");
            form.reset();
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar al servidor. Verifica tu conexión.");
        }
    });

    function updateWelcomeMessage() {
        const name = localStorage.getItem("name");
    
        if (name) {
            // Actualiza el saludo en el dashboard
            const welcomeMessage = document.querySelector('h2');
            welcomeMessage.textContent = `¡Bienvenido de nuevo, ${name}!`;
    
            // Actualiza el saludo en la barra superior
            const headerSpan = document.querySelector('.header-icons span');
            headerSpan.textContent = `Hola, ${name}`;
        } else {
            console.warn("No se encontró un nombre en localStorage.");
        }
    }

    function addEventToList(eventData) {
        // Lógica para agregar el evento dinámicamente a una lista (si es necesario)
        console.log("Evento agregado a la lista:", eventData);
    }
});
