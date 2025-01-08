// Rutas válidas del frontend
const validRoutes = [
    '/',
    '/crearEvento.html',
    '/dashboardAdmin.html',
    '/detallesEventos.html',
    '/eventsManagement.html',
    '/gestionUsuarios.html',
    '/index.html',
    '/login.html',
    '/register.html',
];

// Detectar la ruta actual
const currentPath = window.location.pathname;

// Verificar si la ruta es válida
if (!validRoutes.includes(currentPath)) {
    // Redirigir a la página 404
    window.location.href = '/404.html';
}
