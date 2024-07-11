document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(signupForm);

        try {
            const response = await axios.post('/user/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (data.success) {
                alert('Sign up successful!');
                // Optionally, you can add code to redirect to the login page.
                window.location.href = 'login.html';
            } else {
                alert('Error signing up: ' + data.error);
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    });
});
