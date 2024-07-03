document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Username:', username);
    console.log('Password:', password);
    
    alert('Login successful!');
  });
  