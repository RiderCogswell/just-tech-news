// in its own file so every page does not load this script

// signup handler
async function signupFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // validates that fields have values before POST request
    if (username && email && password) {
        // makes promise a function that can be called in a much cleaner way
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        // check response status - error handling
        if (response.ok) {
            console.log('success');
        } else {
            alert(response.statusText);
        }
    }
}

// login handler
async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    // validates that fields have values before POST request
    if (email && password) {
        // makes promise a function that can be called in a much cleaner way
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        // check response status - error handling
        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        };
    };
};


// query and listen for submit
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
