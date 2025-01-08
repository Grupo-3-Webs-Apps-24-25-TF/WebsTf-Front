document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://www.amoamel.com/web/api/events/post-user";
    const API_URL2 = "https://www.amoamel.com/web/api/events/image";

    const token = localStorage.getItem("token");
    const form = document.getElementById("eventForm");

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
        const imageFile = form.image.files[0];
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
            // Se crea el evento
            const eventData = {
                title,
                description,
                hourStarting: startTime, 
                hourEnding: endTime,     
                location,
                category,
                date,
                registerLink,
            };

            const createEventResponse = await fetch(API_URL, {
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
            const eventId = createdEvent.event._id;  
            console.log("Evento creado con éxito. ID:", eventId);

            // Se sube la imagen al evento
            let imageUrl = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("eventId", eventId); 

                try {
                    const uploadImageResponse = await fetch(API_URL2, {
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
                    imageUrl = imageResponse.imageUrl;  
                    console.log("Imagen subida con éxito:", imageUrl);
                } catch (error) {
                    console.error("Error al subir la imagen:", error);
                    alert("Hubo un problema al intentar subir la imagen.");
                    return;
                }
            }

            alert("Evento creado y imagen subida con éxito.");
            form.reset();
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar al servidor. Verifica tu conexión.");
        }
    });
});
