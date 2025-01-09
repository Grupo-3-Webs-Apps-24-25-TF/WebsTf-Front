document.addEventListener('DOMContentLoaded', () => {
    const BASE_API_URL = "https://www.amoamel.com/web/api/events";
    const token = localStorage.getItem("token");
    updateWelcomeMessage();
    
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', async function() {
            const name = document.getElementById('search-name').value.toLowerCase().trim();
            const category = document.getElementById('categories').value.toLowerCase();
            const date = document.getElementById('date').value;
            const status = document.getElementById('eventStatus').value.toLowerCase();

            // Verifica si solo se ha ingresado un nombre sin otros filtros
            if (!name && !category && !date && !status) {
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = '<p>Por favor, seleccione al menos un filtro para realizar la búsqueda.</p>';
                return; // No continua con la búsqueda si solo se ha ingresado el nombre
            }

            // Verifica si solo se ha ingresado un nombre sin otros filtros
            if (name && !category && !date && !status) {
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = '<p>Por favor, seleccione al menos un filtro adicional (Categoría, Fecha o Estado) para realizar la búsqueda.</p>';
                return; // No continua con la búsqueda si solo se ha ingresado el nombre
            }

            // Validación de la fecha
            if (date && isNaN(new Date(date).getTime())) {
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = '<p>La fecha ingresada no es válida. Por favor, ingrese una fecha válida.</p>';
                return; // No continúa si la fecha es inválida
            }

            let apiUrl = BASE_API_URL;

            // Determina la ruta según los filtros aplicados
            if (date) {
                apiUrl = `${BASE_API_URL}/getByDay?date=${date}`;
            } else if (category) {
                apiUrl = `${BASE_API_URL}/getByWeek?category=${category}`;
            } else if (status) {
                apiUrl = `${BASE_API_URL}/getByMonth?status=${status}`;
            }

            try {
                const response = await fetch(apiUrl, {
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

                // Filtra los eventos basados en los valores de búsqueda adicionales
                const filteredEvents = events.filter(event => {
                    const eventTitle = event.title.toLowerCase();
                    const eventCategory = event.category.toLowerCase();
                    const eventStatus = event.status.toLowerCase();

                    // Verifica si el evento cumple con todos los filtros
                    const matchesName = name ? eventTitle.includes(name) : true;
                    const matchesCategory = category ? eventCategory.includes(category) : true;
                    const matchesStatus = status ? eventStatus === status : true;

                    return matchesName && matchesCategory && matchesStatus;
                });

                // Limpia los resultados anteriores
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = '';

                // Muestra los eventos filtrados
                if (filteredEvents.length > 0) {
                    filteredEvents.forEach(event => {
                        const eventCard = document.createElement('div');
                        eventCard.classList.add('event-card');
                        eventCard.id = event._id; // Asigna el ID del evento al contenedor de la tarjeta

                        eventCard.innerHTML = `
                            <div class="event-details">
                                <h3>${event.title}</h3>
                                <p><strong>Público Objetivo:</strong> ${event.category || 'N/A'}</p>
                                <p><strong>Organizador:</strong> ${event.user.name || 'N/A'}</p>
                                <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es-ES')}</p>
                                <p><strong>Hora Inicio:</strong> ${event.hourStarting}</p>
                                <p><strong>Hora Fin:</strong> ${event.hourEnding}</p>
                                <p><strong>Descripción:</strong> ${event.description}</p>
                                <p><strong>Estado:</strong> ${event.status}</p>
                            </div>
                            <div class="event-actions">
                                <button class="approve" onclick="approveEvent('${event._id}')">Aprobar</button>
                                <a href="detallesEventos.html">
                                    <button class="details" onclick="saveEventId('${event._id}', '${event.date}')">Ver Detalles</button>
                                </a>
                                <button class="edit">Editar</button>
                                <button class="delete" onclick="deleteEvent('${event._id}')">Eliminar</button>
                                <button class="reject">Rechazar</button>
                            </div>
                        `;

                        // Agrega la tarjeta al contenedor
                        eventsList.appendChild(eventCard);
                    });
                    
                } else {
                    eventsList.innerHTML = '<p>No se encontraron eventos para la fecha seleccionada.</p>';
                }
            } catch (error) {
                console.error('Error:', error);
                const eventsList = document.getElementById('eventsList');
                eventsList.innerHTML = '<p>Error al cargar los eventos. Por favor, intente nuevamente más tarde.</p>';
            }
        });
    } else {
        console.error('El elemento .search-button no se encuentra en el DOM.');
    }
});

// Función para guardar el ID del evento
function saveEventId(eventId, eventDate) {
    const formattedDate = new Date(eventDate).toISOString().split('T')[0]; // Convierte la fecha al formato YYYY-MM-DD
    localStorage.setItem('selectedEventId', eventId);
    localStorage.setItem('selectedEventDate', formattedDate);
    console.log(`Evento seleccionado: ${eventId}, Fecha: ${formattedDate}`); // Para depuración
}

function updateWelcomeMessage() {
    const name = localStorage.getItem("name");

    if (name) {
        // Actualiza el saludo en la barra superior
        const headerSpan = document.querySelector('.header-icons span');
        headerSpan.textContent = `Hola, ${name}`;
    } else {
        console.warn("No se encontró un nombre en localStorage.");
    }
}   