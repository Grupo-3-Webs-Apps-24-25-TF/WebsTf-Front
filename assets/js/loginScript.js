// Recoge los daotos
const btnLogin = document.getElementById('btnLogin');
const userName = document.getElementById('txtUsername');
const password = document.getElementById('txtPassword');

btnLogin.addEventListener('click', () => {
    alert(`Usuario: ${userName.value} - ${password.value}`);
});