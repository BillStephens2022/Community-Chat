// function to handle the login

const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#login-email').value.trim();
    const password = document.querySelector('#login-password').value.trim();
  
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        window.location.reload(true);
        window.location.replace('/dashboard');

        
      } else {
        alert('Failed to log in');
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);