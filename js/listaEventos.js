document.addEventListener('DOMContentLoaded', () => {
    const BASE_API_URL = "https://www.amoamel.com/web/api/events";
    const token = localStorage.getItem("token");
    console.log("Token:", token);  // Verifica que el token esté presente
    // const decodedToken = decodeToken(token);
    // console.log(decodedToken); // Aquí verás el contenido del token, incluyendo el ro   

    
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



// Función para eliminar un evento
function deleteEvent(eventId) {
    
    const token = localStorage.getItem("token");
    console.log("Token:", token);  // Verifica que el token esté presente
    // const decodedToken = decodeToken(token);
    // console.log(decodedToken); // Aquí verás el contenido del token, incluyendo el ro   

    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        return;
    }

    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este evento?");
    if (!confirmDelete) {
        return;
    }

    console.log("Event ID:", eventId);
    // Enviar el eventId en el cuerpo de la solicitud
    fetch('https://www.amoamel.com/web/api/events/' + eventId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    .then(response => response.json())
    .then(data => {
        if (data.message === "Event deleted successfully") {
            const eventCard = document.getElementById(eventId);
            if (eventCard) {
                eventCard.remove();
            }
            alert('Evento eliminado exitosamente');
        } else {
            alert('No se pudo eliminar el evento: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al eliminar el evento:', error);
        alert('Ocurrió un error al intentar eliminar el evento.');
    });
    
}



function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


// Función para aprobar un evento
function approveEvent(eventId) {
    const token = localStorage.getItem("token"); // Obtén el token de autenticación

    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        return;
    }

    // Llama a la API para aprobar el evento
    fetch(`https://www.amoamel.com/web/api/events/approve?eventId=${eventId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.event) {
            alert('Evento aprobado exitosamente');
            // Actualiza la interfaz para reflejar el estado aprobado
            const eventCard = document.getElementById(eventId);
            if (eventCard) {
                eventCard.querySelector('.status').textContent = 'Aprobado';
            }
        } else {
            alert('Error al aprobar el evento: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al aprobar el evento:', error);
        alert('Ocurrió un error al intentar aprobar el evento.');
    });
    
}

