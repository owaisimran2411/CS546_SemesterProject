$(document).ready(function () {
    let loginForm = $('#login-form');

    loginForm.submit(function (event) {
        event.preventDefault();
        let errorDiv = $('#login-errors');
        errorDiv.empty();

        let username = $('#username').val();
        if (!username) {
            errorDiv.append('<p>You must provide a username!</p>');
            return;
        }
        username = username.trim();
        if (username.length === 0) {
            errorDiv.append('<p>You must provide a username!</p>');
            return;
        }

        let password = $('#password').val();
        if (!password) {
            errorDiv.append('<p>You must provide a password!</p>');
            return;
        }
        password = password.trim();
        if (password.length === 0) {
            errorDiv.append('<p>You must provide a password!</p>');
            return;
        }
        if (/\s/.test(password)) {
            errorDiv.append('<p>Password should not contain spaces.</p>');
            return;
        }
        const specialCharacters = "!@#$%^&*()-_+=<>?/\\";
        if (password.length < 8) {
            errorDiv.append('<p>Password should be at least 8 characters long.</p>');
            return;
        }
        let isUppercase = false;
        let isLowercase = false;
        let isNumber = false;
        let isSpecialCharacter = false;
        for (let char of password) {
            if (char >= "A" && char <= "Z") {
                isUppercase = true;
            }
            if (char >= "a" && char <= "z") {
                isLowercase = true;
            }
            if (!isNaN(char)) {
                isNumber = true;
            }
            if (specialCharacters.includes(char)) {
                isSpecialCharacter = true;
            }
        }

        if (!isUppercase) {
            errorDiv.append('<p>Password should contain at least one uppercase character.</p>');
            return;
        }

        if (!isLowercase) {
            errorDiv.append('<p>Password should contain at least one lowercase character.</p>');
            return;
        }

        if (!isNumber) {
            errorDiv.append('<p>Password should contain at least one number.</p>');
            return;
        }

        if (!isSpecialCharacter) {
            errorDiv.append('<p>Password should contain at least one special character.</p>');
            return;
        }
        this.submit();
    });
});