// function to handle registration where user enters username, email and password.
const registerFormHandler = async (event) => {
    event.preventDefault();
    const username = document.querySelector('#register-username').value.trim();
    const email = document.querySelector('#register-email').value.trim();
    const password = document.querySelector('#register-password').value.trim();
    // ensures all 3 values are entered before sending to the back end
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to Register');
      }
    }
  };

document.querySelector(".register-form").addEventListener("submit", registerFormHandler);