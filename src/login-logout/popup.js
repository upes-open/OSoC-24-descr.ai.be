document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Here you can handle the authentication logic (e.g., API call)
    console.log('Username:', username);
    console.log('Password:', password);
    
    // Display an alert for demonstration purposes
    alert('Login successful!');
  });
  