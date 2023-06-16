document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Send the registration data to the backend
  fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  })
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error: ' + response.status);
    }
  })
  .then(function(data) {
    // Registration successful, display a success message or redirect the user
    console.log('Registration successful:', data);
  })
  .catch(function(error) {
    // Display an error message
    console.error('Registration failed:', error);
  });
});