
document.addEventListener("DOMContentLoaded", () => {
    // Obtén el rol del usuario (puede venir de localStorage, cookies o una API)
    const userRole = localStorage.getItem('role'); // Ejemplo: "admin" o "usuario"

    // Elementos que queremos ocultar para usuarios normales
    const approveEventsLink = document.getElementById('approve-events-link');
    const manageUsersLink = document.getElementById('manage-users-link');

    // Si el usuario no es admin, ocultamos las opciones de admin
    if (userRole !== 'Administrador') {
        if (approveEventsLink) approveEventsLink.style.display = 'none';
        if (manageUsersLink) manageUsersLink.style.display = 'none';
    }



});