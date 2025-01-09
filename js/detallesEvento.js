document.addEventListener('DOMContentLoaded', async () => {
    const eventId = localStorage.getItem('selectedEventId'); // Obtener el ID del evento desde el localStorage
    const eventDate = localStorage.getItem('selectedEventDate'); // Obtener la fecha del evento desde el localStorage
    const token = localStorage.getItem("token"); // Obtener el token para autorización
    updateWelcomeMessage();

    if (!eventId) {
        console.error('No se encontró el ID del evento.');
        return;
    }

    if (!eventDate) {
        console.error('No se encontró la fecha del evento.');
        alert('Por favor, selecciona una fecha para el evento.');
        return;
    }

    console.log("Event ID:", eventId);
    console.log("Event Date:", eventDate);  

    try {
        // Hacer la solicitud al backend para obtener los eventos del día
        const response = await fetch(`https://www.amoamel.com/web/api/events/getByDay?date=${eventDate}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los eventos del día');
        }

        const data = await response.json();

        // Filtra el evento específico por ID
        const event = data.events.find(e => e._id === eventId);
        if (!event) {
            throw new Error('Evento no encontrado en la lista del día');
        }

        // Crea el HTML dinámicamente
        const eventDetailsContainer = document.getElementById('event-details-container');

        // Crea los elementos HTML
        const mainElement = document.createElement('main');
        mainElement.id = 'event-details';

        // Título del evento
        const title = document.createElement('h2');
        title.id = 'event-name';
        title.textContent = event.title || '[Nombre del Evento]';
        mainElement.appendChild(title);

        // Información del evento
        const eventInfo = document.createElement('div');
        eventInfo.classList.add('event-info');
        
        const infoLeft = document.createElement('div');
        infoLeft.classList.add('info-left');
        infoLeft.innerHTML = `
            <p><strong>Fecha:</strong> <span id="event-date">${new Date(event.date).toLocaleDateString() || '[Fecha del Evento]'}</span></p>
            <p><strong>Hora Inicio:</strong> <span id="event-start-time">${event.hourStarting || '[Hora del Evento]'}</span></p>
            <p><strong>Hora Fin:</strong> <span id="event-end-time">${event.hourEnding || '[Hora del Evento]'}</span></p>
        `;
        
        const infoRight = document.createElement('div');
        infoRight.classList.add('info-right');
        infoRight.innerHTML = `
            <p><strong>Ubicación:</strong> <span id="event-location">${event.location || '[Ubicación del Evento]'}</span></p>
            <p><strong>Estado:</strong> <span id="event-status">${event.status || '[Estado del Evento]'}</span></p>
        `;

        eventInfo.appendChild(infoLeft);
        eventInfo.appendChild(infoRight);
        mainElement.appendChild(eventInfo);

        // Descripción y detalles
        const detailsSection = document.createElement('div');
        detailsSection.classList.add('details-section');
        
        const descriptionBox = document.createElement('div');
        descriptionBox.classList.add('box');
        descriptionBox.innerHTML = `
            <h3>DESCRIPCIÓN DEL EVENTO</h3>
            <p id="event-description">${event.description || '[Descripción breve del evento]'}</p>
        `;
        
        const imageBox = document.createElement('div');
        imageBox.classList.add('box');
        const eventImageUrl = event.image || ''; // Si no hay imagen, se deja vacío
        imageBox.innerHTML = ` 
            <h3>IMAGEN DEL EVENTO</h3>
            <img id="event-image" src="${eventImageUrl}" alt="Imagen del Evento" />
            <p id="no-image-message" style="display: none; color: red;">No se ha cargado la imagen correctamente o no tiene imagen.</p>
        `;

        // Verifica si la imagen se ha cargado correctamente
        const imgElement = imageBox.querySelector('img');
        const noImageMessage = imageBox.querySelector('#no-image-message');

        imgElement.onerror = () => {
            // Si la imagen no se carga, muestra el mensaje de error
            imgElement.style.display = 'none';
            noImageMessage.style.display = 'block';
        };

        if (!eventImageUrl) {
            // Si no hay imagen, muestr el mensaje de "No hay imagen"
            imgElement.style.display = 'none';
            noImageMessage.style.display = 'block';
        }

        const qrBox = document.createElement('div');
        qrBox.classList.add('box');
        
        // Verifica si existe un código QR o un enlace
        if (event.qrCode) {
            qrBox.innerHTML = `
                <h3>CÓDIGO QR DE REGISTRO</h3>
                <img id="event-qr" src="${event.qrCode}" alt="Código QR" />
            `;
        } else if (event.registerLink) {
            qrBox.innerHTML = `
                <h3>ENLACE DE REGISTRO</h3>
                <a href="${event.registerLink}" target="_blank">${event.registerLink}</a>
            `;
        } else {
            qrBox.innerHTML = `
                <h3>REGISTRO NO DISPONIBLE</h3>
                <p>No hay un código QR ni un enlace de registro disponible.</p>
            `;
        }

        detailsSection.appendChild(descriptionBox);
        detailsSection.appendChild(imageBox);
        detailsSection.appendChild(qrBox);
        mainElement.appendChild(detailsSection);

        // Botones de acción
        const buttons = document.createElement('div');
        buttons.classList.add('buttons');
        buttons.innerHTML = `
            <button id="approve-event">Aprobar evento</button>
            <button id="edit-event" onclick="redirectToEditEvent('${event._id}')">Editar evento</button>
            <button id="reject-event">Rechazar evento</button>
        `;
        mainElement.appendChild(buttons);

        // Agregar el contenido dinámico al contenedor
        eventDetailsContainer.appendChild(mainElement);

        // Botones de acción
        document.getElementById('approve-event').addEventListener('click', () => {
            alert('Evento aprobado');
        });

        // document.getElementById('edit-event').addEventListener('click', () => {
        //     localStorage.setItem('selectedEventId', event._id); // Guardar el ID del evento
        //     window.location.href = 'editarEvento.html'; // Redirigir a la página de edición
        // });

        document.getElementById('reject-event').addEventListener('click', () => {
            alert('Evento rechazado');
        });

    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cargar el evento.');
    }
});

function redirectToEditEvent(eventId) {
    localStorage.setItem('selectedEventId', eventId); // Guardar el ID del evento en localStorage
    console.log(`Redirigiendo a la edición del evento con ID: ${eventId}`); // Para depuración
    window.location.href = 'editarEvento.html'; // Redirigir a la página de edición
}

function updateWelcomeMessage() {
    const name = localStorage.getItem("name");

    if (name) {
        // Actualiza el saludo en la barra superior
        const headerSpan = document.querySelector('.header-right span');
        headerSpan.textContent = `Hola, ${name}`;
    } else {
        console.warn("No se encontró un nombre en localStorage.");
    }
} 