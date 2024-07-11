// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\public\login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Use FormData directly
        const formData = new FormData(loginForm);

        try {
            const response = await axios.post('/user/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (data.success) {
                // Login was successful
                alert('Login successful!');
                console.log(data.token);
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html'; // Redirect to the dashboard in the 'public' directory
            } else {
                // Login failed
                alert('Login failed. Please check your email and password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert(`Error logging in: ${error.message}`);

        }
    });
    const forgotPasswordButton = document.getElementById('forgot-password-btn');
    forgotPasswordButton.addEventListener('click', () => {
        console.log("Forgot password clicked");
        window.location.href = "./forgotpassword.html";
    });
});

