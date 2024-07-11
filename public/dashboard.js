document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Dynamically load Razorpay script
        const razorpayScript = document.createElement('script');
        razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
        document.head.appendChild(razorpayScript);

        // Wait for Razorpay script to be loaded
        await new Promise(resolve => {
            razorpayScript.onload = resolve;
        });

        // Initialize Razorpay and your code
        initializeRazorpay();
    } catch (error) {
        console.error('Error loading Razorpay:', error);
    }

    const premiumButton = document.getElementById('rzp-button1');
    const premiumMessage = document.getElementById('premium-message');

    // Fetch premium status from the backend
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get('/premium/getPremiumStatus', {
            headers: {
                'Authorization': token,
            },
        });

        const isPremium = response.data.isPremium;

        if (isPremium) {
            // User is premium, hide the premium button and show the premium message
            premiumButton.style.display = 'none';

            // Style the premium message with red color
            premiumMessage.innerHTML = 'You are a premium user.';
            premiumMessage.style.color = 'red'; // Adjust styling as needed

            // Create and append the "Show Leaderboard" button
            const showLeaderboardButton = document.createElement('button');
            showLeaderboardButton.innerText = 'Show Leaderboard';
            showLeaderboardButton.id = 'show-leaderboard-button';
            showLeaderboardButton.addEventListener('click', handleShowLeaderboard);

            // Append the showLeaderboardButton after the premiumMessage
            premiumMessage.parentNode.appendChild(showLeaderboardButton);

            // Enable the download button for premium users
            const downloadButton = document.getElementById('downloadButton');
            if (downloadButton) {
                downloadButton.style.display = 'block'; // Show the download button for premium users
                downloadButton.addEventListener('click', download); // Add event listener for download only for premium users
            }
        } else {
            // User is not premium, hide the download button
            const downloadButton = document.getElementById('downloadButton');
            if (downloadButton) {
                downloadButton.style.display = 'none'; // Hide the download button for non-premium users
            }
        }
    } catch (error) {
        console.error('Error fetching premium status:', error);
    }

    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');

    // Read the user's preference from local storage
    const userPreference = localStorage.getItem('expensesPerPage');

    // Initialize expenses per page with the stored preference or a default value
    let expensesPerPage = userPreference ? parseInt(userPreference, 10) : 10;
    console.log("expenseperpage", expensesPerPage);
    // Initialize pagination with the first page
    let currentPage = 1;
    let totalPages = 1;

    fetchAndDisplayExpenses(currentPage);

    // Add an event listener to the "Next Page" button
    const nextPageButton = document.getElementById('nextPageButton');
    nextPageButton.addEventListener('click', () => {
        currentPage += 1;
        fetchAndDisplayExpenses(currentPage);
    });

    // Add an event listener to the "Previous Page" button
    const previousPageButton = document.getElementById('previousPageButton');
    previousPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            fetchAndDisplayExpenses(currentPage);
        }
    });

    // Function to fetch and display expenses
    async function fetchAndDisplayExpenses(page) {
        console.log(`Fetching expenses for page ${page} with ${expensesPerPage} expenses per page...`);

        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/expense/getExpenses?page=${page}&pageSize=${expensesPerPage}`, {
                headers: {
                    'Authorization': token,
                },
            });

            const data = response.data;
            console.log('Expenses received:', response);

            // Log the values for debugging
            console.log('Total Expenses:', data.totalExpenses);
            console.log('Page Size:', data.pageSize);

            // Update total pages
            totalPages = Math.ceil(data.totalExpenses / data.pageSize);

            // Update HTML to display current page and total pages
            const currentPageElement = document.getElementById('currentPage');
            const totalPagesElement = document.getElementById('totalPages');
            currentPageElement.textContent = `Page ${currentPage}`;
            totalPagesElement.textContent = totalPages;

            expensesList.innerHTML = '';

            data.expenses.forEach((expense) => {
                const expenseElement = document.createElement('div');
                expenseElement.className = 'expense-item';
                expenseElement.innerHTML = `
                    <span> &#8226; Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}</span>
                    <button class="delete-button" data-expense-id="${expense._id}">Delete</button>
                `;
                expensesList.appendChild(expenseElement);
            });

            // Add event listeners to the delete buttons
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach((button) => {
                button.addEventListener('click', handleDeleteExpense);
            });
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    function saveUserPreference(preferences) {
        localStorage.setItem('expensesPerPage', preferences.expensesPerPage);
    }

    const savePreferenceButton = document.getElementById('savePreference');
    savePreferenceButton.addEventListener('click', () => {
        // Get the value from the input field
        const expensesPerPageInput = document.getElementById('expensesPerPage');
        const newExpensesPerPage = parseInt(expensesPerPageInput.value, 10);

        // Update the expenses per page variable before saving to local storage
        expensesPerPage = newExpensesPerPage;

        // Save the new preference to local storage
        saveUserPreference({ expensesPerPage: newExpensesPerPage });

        // Fetch and display expenses for the current page
        fetchAndDisplayExpenses(currentPage);
    });

    if (expensesList) {
        // Add an event listener for the expense form submission
        expenseForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(expenseForm);
            const formDataObject = {};
            for (const [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }

            const token = localStorage.getItem('token');

            try {
                const response = await axios.post('/expense/addExpense', formDataObject, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });

                const data = response.data;

                if (data.success) {
                    // Expense added successfully, fetch and display all expenses
                    fetchAndDisplayExpenses(currentPage);
                } else {
                    console.error('Error adding expense:', data.error);
                }
            } catch (error) {
                console.error('Error adding expense:', error);
            }
        });
    } else {
        console.error("Element with ID 'expenses-list' not found.");
    }

    async function handleDeleteExpense(event) {
        const expenseId = event.target.getAttribute('data-expense-id');

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/expense/deleteExpense/${expenseId}`, {
                headers: {
                    'Authorization': token,
                },
            });

            // Expense deleted successfully, fetch and display all expenses
            fetchAndDisplayExpenses(currentPage);
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

    function initializeRazorpay() {
        document.getElementById('rzp-button1').onclick = async function (e) {
            const token = localStorage.getItem('token');
            const response = await axios.get('/purchase/premiummembership', {
                headers: {
                    "Authorization": token
                }
            });
            var options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function (response) {
                    await axios.post('/purchase/updatetransactionstatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, {
                        headers: { "Authorization": token }
                    });

                    alert('You are a Premium User Now ');
                    document.getElementById('rzp-button1').style.display = 'none';
                },
            };

            const rzpl = new Razorpay(options);
            rzpl.open();
            e.preventDefault();

            rzpl.on('payment.failed', async function (response) {
                console.log(response);
                await axios.post('/purchase/updatetransactionstatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, {
                    headers: { "Authorization": token }
                });
                alert('Something went wrong');
            });
        };
    }
    // Add this function to handle Show Leaderboard button click
    async function handleShowLeaderboard() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/purchase/premiumleaderboard', {
                headers: {
                    'Authorization': token,
                },
            });

            const leaderboardData = response.data.leaderboardData;
            console.log("line 215:", leaderboardData);

            // Clear existing leaderboard content
            const existingLeaderboard = document.getElementById('premium-leaderboard');
            if (existingLeaderboard) {
                existingLeaderboard.remove();
            }

            // Display premium leaderboard data (modify this part based on your HTML structure)
            if (leaderboardData && leaderboardData.length > 0) {
                const leaderboardMessage = document.createElement('div');
                leaderboardMessage.id = 'premium-leaderboard';
                leaderboardMessage.innerHTML = '<h2>Premium User Leaderboard</h2>';

                leaderboardData.forEach(user => {
                    console.log(`Name: ${user.name}, Total Expense: ${user.totalExpenses}`);
                    const userElement = document.createElement('div');
                    userElement.innerHTML = `<span>Name-${user.name}: Total Expense-${user.totalExpenses}</span>`;
                    leaderboardMessage.appendChild(userElement);
                });

                // Append the leaderboardMessage to the body or any other container you want
                document.body.appendChild(leaderboardMessage);
            } else {
                alert('No premium users found.');
            }
        } catch (error) {
            console.error('Error fetching premium leaderboard:', error);
        }
    }
    function download() {
        axios.get('/expense/download', { headers: { "Authorization": token } })
            .then((response) => {
                if (response.status === 200) {
                    console.log("download function");
                    console.log('File URL:', response.data.downloadUrl); // Log the URL to check if it's present
                    var a = document.createElement("a");
                    a.href = response.data.downloadUrl;
                    a.download = 'myexpense.csv';
                    a.click();
                } else {
                    throw new Error(response.data.message);
                }
            })
            .catch((err) => {
                console.error('Error:', err.message);
            });
    }
    try {
        const token = localStorage.getItem('token');
        const downloadedFilesResponse = await axios.get('/expense/downloadedFiles', {
            headers: {
                'Authorization': token,
            },
        });

        const downloadedFiles = downloadedFilesResponse.data.downloadedFiles;

        if (downloadedFiles && downloadedFiles.length > 0) {
            // Display downloaded files (modify this part based on your HTML structure)
            const downloadedFilesContainer = document.getElementById('downloaded-files-container');
            downloadedFilesContainer.innerHTML = '<h2>Downloaded Files</h2>';

            downloadedFiles.forEach(file => {
                // Create a clickable link for each downloaded file
                const linkElement = document.createElement('a');
                linkElement.href = file.file_url;
                linkElement.target = '_blank'; // Open the link in a new tab
                linkElement.textContent = `Downloaded on ${new Date(file.download_date).toLocaleString()}`;

                // Append the link to the container
                downloadedFilesContainer.appendChild(linkElement);

                // Add a line break for better separation
                downloadedFilesContainer.appendChild(document.createElement('br'));
            });
        } else {
            // No downloaded files found
            console.log('No downloaded files found.');
        }
    } catch (error) {
        console.error('Error fetching downloaded files:', error);
    }

});