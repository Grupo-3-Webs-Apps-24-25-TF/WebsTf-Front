// Recoge los daotos
const btnRegister = document.getElementById('btnRegister');
const fullName = document.getElementById('txtFullName');
const userName = document.getElementById('txtUsername');
const password = document.getElementById('txtPassword');
const confirmPassword = document.getElementById('txtConfirmPassword');

btnRegister.addEventListener('click', () => {
    alert(`Usuario: ${userName.value} - ${password.value}`);
});