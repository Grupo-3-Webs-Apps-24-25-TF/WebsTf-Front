document.getElementById('sendCodeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('Email').value;

    const response = await fetch('https://www.amoamel.com/web/api/users/sendCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();

    const emailMessage = document.getElementById('email-message');
    if (response.ok) {
        emailMessage.textContent = 'Código enviado a tu correo electrónico.';
        emailMessage.style.display = 'block';
        document.getElementById('email-form').style.display = 'none';
        document.getElementById('verify-code-form').style.display = 'block';
    } else {
        emailMessage.textContent = data.message || 'Error al enviar el código.';
        emailMessage.style.display = 'block';
    }
});

document.getElementById('verifyCodeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const verificationCode = document.getElementById('VerificationCode').value;
    const email = document.getElementById('Email').value;

    const response = await fetch('https://www.amoamel.com/web/api/users/verifyCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verificationCode, userId: email })
    });

    const data = await response.json();

    const verifyMessage = document.getElementById('verify-message');
    if (response.ok) {
        verifyMessage.textContent = 'Código verificado con éxito.';
        verifyMessage.style.display = 'block';
        document.getElementById('verify-code-form').style.display = 'none';
        document.getElementById('reset-password-form').style.display = 'block';
    } else {
        verifyMessage.textContent = data.message || 'Código incorrecto.';
        verifyMessage.style.display = 'block';
    }
});

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('Password').value;
    const email = document.getElementById('Email').value;

    const response = await fetch('https://www.amoamel.com/web/api/users/updatePassword', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword, userId: email })
    });

    const data = await response.json();

    const resetMessage = document.getElementById('reset-message');
    if (response.ok) {
        resetMessage.textContent = 'Contraseña actualizada con éxito.';
        resetMessage.style.display = 'block';
    } else {
        resetMessage.textContent = data.message || 'Error al actualizar la contraseña.';
        resetMessage.style.display = 'block';
    }
});
