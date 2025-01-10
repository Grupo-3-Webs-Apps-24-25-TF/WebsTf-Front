document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://www.amoamel.com/web/api/users/myUser";
    const BASE_API_URL = "https://www.amoamel.com/web/api/events";

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (response.ok) {
            const result = await response.json();

            const welcomeMessage = document.querySelector('h2');
            welcomeMessage.textContent = `¡Bienvenido de nuevo, ${result.user.name}!`;

            const headerSpan = document.querySelector('.header-right span');
            headerSpan.textContent = `Hola, ${result.user.name}`;

            eventsCards("Pendiente");
        } else {
            console.error(`Error ${error.message}:`);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }

    async function eventsCards(status) {
        try {
            const response = await fetch(BASE_API_URL + "/getByWeek?category=profesores", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los eventos');
            }

            const data = await response.json();
            let events = [];

            // Verifica si la respuesta es un objeto agrupado (por semana o mes)
            if (Array.isArray(data.events)) {
                events = data.events; 
            } else {
                // Si es un objeto agrupado, extrae los eventos de todas las claves
                for (const key in data.groupedEvents) {
                    if (data.groupedEvents.hasOwnProperty(key)) {
                        events = events.concat(data.groupedEvents[key]);
                    }
                }
            }
            const filteredEvents = events.filter(event => {
                const eventStatus = event.status; // Asumiendo que `event` tiene un campo `status`
            
                // Filtra solo por estado
                return status ? eventStatus === status : true;
            });            
            
            // Actualizar el texto dependiendo de tu categoría
            const paragraph = document.getElementById('eventCount');
            paragraph.textContent = `Tienes ${filteredEvents.length} eventos pendientes de revisión.`;
            
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '';
            // Muestra los eventos filtrados por categoría
            if (filteredEvents.length > 0) {
                filteredEvents.forEach(event => {
                    const eventCard = document.createElement('div');
                    
                    eventCard.classList.add('event-card');
                    eventCard.id = event._id; // Asigna el ID del evento al contenedor de la tarjeta
                    
                    eventCard.innerHTML = `
                        <div class="event-details">
                            <h3>${event.title}</h3>
                            <p><strong>Descripción:</strong> ${event.description}</p>
                            <p><strong>Organizador:</strong> ${event.user.name || 'N/A'}</p>
                            <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES')}</p>
                            <p><strong>Hora Inicio:</strong> ${event.hourStarting}</p>
                            <p><strong>Hora Fin:</strong> ${event.hourEnding}</p>
                            <p><strong>Estado:</strong> ${event.status}</p>
                        </div>
                    `;

                    // Agrega la tarjeta al contenedor
                    eventsList.appendChild(eventCard);
                });
                
            } else {
                eventsList.innerHTML = '<p>No se encontraron eventos para la categoría del usuario.</p>';
            }
        } catch (error) {
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '<p>No hay eventos proximamente.</p>';
        }
    }

    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.removeItem('token');

        window.location.href = "index.html";
    });
});