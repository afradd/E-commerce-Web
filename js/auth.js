document.addEventListener('DOMContentLoaded', function() {
    const isAuthPage = document.getElementById('signInForm') || document.getElementById('signUpForm');
    if (isAuthPage && getCurrentUser()) {
        window.location.href = 'index.html';
    }

    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = signInForm.email.value;
            const password = signInForm.password.value;
            clearMessages();
            if (!email || !password) {
                showMessage('Please enter email and password', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showMessage('Invalid email address', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            storeUserData({ email: email });
            showMessage('Sign in successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }

    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = signUpForm.fullName.value;
            const email = signUpForm.email.value;
            const password = signUpForm.password.value;
            const confirmPassword = signUpForm.confirmPassword.value;
            const agree = signUpForm.agreeTerms.checked;
            clearMessages();
            if (!name || !email || !password || !confirmPassword) {
                showMessage('Please fill all fields', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showMessage('Invalid email address', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            if (!agree) {
                showMessage('Please agree to the Terms & Conditions', 'error');
                return;
            }
            storeUserData({ name: name, email: email });
            showMessage('Account created! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(msg, type) {
    let form = document.querySelector('.auth-form');
    if (!form) return;
    clearMessages();
    let div = document.createElement('div');
    div.className = type === 'error' ? 'error-message' : 'success-message';
    div.textContent = msg;
    form.prepend(div);
}

function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(e => e.remove());
}

function storeUserData(user) {
    localStorage.setItem('shophub_user', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('shophub_user');
    return user ? JSON.parse(user) : null;
}

function signOut() {
    localStorage.removeItem('shophub_user');
    window.location.href = 'index.html';
}

window.signOut = signOut;