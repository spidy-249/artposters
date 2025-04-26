// Authentication Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Check if user exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set current user
                localStorage.setItem('currentUser', JSON.stringify(user));
                showNotification('Login successful!');
                
                // Redirect to account page after a delay
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);
            } else {
                showNotification('Invalid email or password');
            }
        });
    }
    
    // Forgot password link
    const forgotPassword = document.getElementById('forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Password reset link sent to your email (simulated)');
        });
    }
    
    // Check if user is already logged in
    checkAuthStatus();
});

function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.querySelector('a[href="login.html"]');
    const accountLink = document.querySelector('a[href="account.html"]');
    
    if (currentUser && loginLink && accountLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
        
        accountLink.textContent = currentUser.name || 'Account';
    }
}