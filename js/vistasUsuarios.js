document.addEventListener("DOMContentLoaded", () => {
    // Obtén el rol del usuario (puede venir de localStorage, cookies o una API)
    const userRole = localStorage.getItem('role'); // Ejemplo: "Administrador" o "Usuario"

    // Elementos que queremos ocultar para usuarios normales
    const approveEventsLink = document.getElementById('approve-events-link');
    const manageUsersLink = document.getElementById('manage-users-link');
    const eventStatusSection = document.querySelector('.contform__label'); // Etiqueta de "Estado"
    const eventStatusSelect = document.getElementById('eventStatus'); // Select de "Estado"

    // Si el usuario no es admin, ocultamos las opciones de admin y la sección de estado
    if (userRole !== 'Administrador') {
        if (approveEventsLink) approveEventsLink.style.display = 'none';
        if (manageUsersLink) manageUsersLink.style.display = 'none';
        if (eventStatusSection) eventStatusSection.style.display = 'none';
        if (eventStatusSelect) eventStatusSelect.style.display = 'none';
    }
});
