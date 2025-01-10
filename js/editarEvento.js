document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://www.amoamel.com/web/api/events/"; // URL para actualizar el evento
    const API_URL2 = "https://www.amoamel.com/web/api/events/image";  // URL para subir la imagen
    const token = localStorage.getItem("token");
    const form = document.getElementById("eventForm");
    const eventId = localStorage.getItem("selectedEventId"); // Obtener el ID del evento desde localStorage

    if (!eventId) {
        console.error('No se encontró el ID del evento.');
        alert('No se ha proporcionado un ID de evento válido.');
        return;
    }

    // Obtener los datos del evento para mostrar en el formulario
    try {
        const eventResponse = await fetch(`https://www.amoamel.com/web/api/events/getByDay?date=${new Date().toISOString().split('T')[0]}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!eventResponse.ok) {
            throw new Error('Error al obtener el evento.');
        }

        const eventData = await eventResponse.json();
        const event = eventData.events.find(event => event._id === eventId);

        if (!event) {
            alert('No se encontró el evento con la ID proporcionada.');
            return;
        }

        // Rellenar el formulario con los datos del evento
        form.title.value = event.title || '';
        form.description.value = event.description || '';
        form.hourStarting.value = event.hourStarting || '';
        form.hourEnding.value = event.hourEnding || '';
        form.location.value = event.location || '';
        form.category.value = event.category || '';
        form.date.value = new Date(event.date).toISOString().split('T')[0] || '';
        form.registerLink.value = event.registerLink || '';

        // Mostrar la imagen actual si existe
        if (event.image) {
            const imgElement = document.createElement('img');
            imgElement.src = event.image;
            imgElement.alt = 'Imagen del Evento';
            imgElement.style.maxWidth = '100px';
            document.getElementById('imagePreviewContainer').appendChild(imgElement);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cargar los detalles del evento.');
    }

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
            // Se crea el objeto de datos del evento
            const eventData = {
                title,
                description,
                hourStarting: startTime, 
                hourEnding: endTime,     
                location,
                category,
                date,
                registerLink,
                image: "../assets/defecto.png"  // Imagen predeterminada si no se selecciona una nueva
            };

            // Actualizar el evento
            const updateEventResponse = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify(eventData),
            });

            if (!updateEventResponse.ok) {
                const error = await updateEventResponse.json();
                console.error("Error al actualizar el evento:", error);
                alert(`Error al actualizar el evento: ${error.message}`);
                return;
            }

            const updatedEvent = await updateEventResponse.json();
            const updatedEventId = updatedEvent.event._id;  // Obtener el ID del evento actualizado
            console.log("Evento actualizado con éxito. ID:", updatedEventId);

            // Si se seleccionó una imagen, se sube en el segundo paso
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("eventId", updatedEventId);  // Asociar la imagen con el evento

                // Subir la imagen al evento
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
                const imageUrl = imageResponse.imageUrl;  
                console.log("Imagen subida con éxito:", imageUrl);
            } else {
                console.log("No se seleccionó imagen, se mantiene la imagen por defecto.");
            }

            alert("Evento actualizado y, si se seleccionó, imagen subida con éxito.");
            form.reset();
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar al servidor. Verifica tu conexión.");
        }
    });
});
