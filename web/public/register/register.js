document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Send the registration data to the backend
  // currently doesnt work as db is not setup
  // also needs encryption + salting + peppering
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
    console.log('Registration successful:', data);
  })
  .catch(function(error) {
    console.error('Registration failed:', error);
  });
});