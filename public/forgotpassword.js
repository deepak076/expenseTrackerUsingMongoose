// C:\Users\DEEPSROCK\Desktop\node-js\Expense tracker\public\forgotpassword.js
function forgotpassword(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get("email"),
    };

    const headers = {
        'api-key': 'xkeysib-xxxxxxxxxxxxxxxxx',
        'content-type': 'application/json',
        'accept': 'application/json',
    };

    axios.post('/password/forgotpassword', userDetails, { headers })
        .then(response => {
            console.log('Server Response:', response);
            if (response.status === 200) {
                document.body.innerHTML += '<div style="color:green;">Mail Successfully sent</div>';
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        })
        .catch(err => {
            console.error('Error:', err);
            document.body.innerHTML += `<div style="color:red;">${err.message || err} </div>`;
        });
}
