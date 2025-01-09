document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://www.amoamel.com/web/api/users/myUser";

    const token = localStorage.getItem('token');

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

            const approveEventsLink = document.getElementById('approve-events-link');
            const manageUsersLink = document.getElementById('manage-users-link');
            const eventStatusSection = document.querySelector('.contform__label');
            const eventStatusSelect = document.getElementById('eventStatus');

            if (result.user.role != 'Administrador') {
                if (approveEventsLink) approveEventsLink.style.display = 'none';
                if (manageUsersLink) manageUsersLink.style.display = 'none';
                if (eventStatusSection) eventStatusSection.style.display = 'none';
                if (eventStatusSelect) eventStatusSelect.style.display = 'none';
            }
        } else {
            const error = await response.json();
            console.error(`Error ${error.message}:`);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
});
