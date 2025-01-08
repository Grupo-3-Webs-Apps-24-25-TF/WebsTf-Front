document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://www.amoamel.com/web/api/events/post-user";
    const token = localStorage.getItem("token");

    const form = document.getElementById("eventForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = form.title.value.trim();
        const description = form.description.value.trim();
        const startTime = form.startTime.value;
        const endTime = form.endTime.value;
        const location = form.location.value.trim();
        const status = form.status.value;
        const category = form.category.value;
        const date = form.date.value;
        const imageFile = form.image.files[0];

        // Validaciones básicas
        if (!title || !status || !category || !date) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (startTime && endTime && startTime >= endTime) {
            alert("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        // se crea un FormData para manejar la imagen y otros datos
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        formData.append("location", location);
        formData.append("status", status);
        formData.append("category", category);
        formData.append("date", date);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": token, 
                },
                body: formData, 
            });

            if (response.ok) {
                alert("Evento creado con éxito.");
                form.reset(); //limpia el formulario desps de un envio exitoso
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar al servidor. Verifica tu conexióoon");
        }
    });
});
