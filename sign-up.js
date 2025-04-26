document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm').value;
  const role = document.querySelector('input[name="role"]:checked').value;

  if (!isValidUsername(username)) {
    alert('Invalid username! Username must be 3-20 characters long and can only contain letters, numbers, and underscores.');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Invalid email format!');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // checks if user already exists
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser) {
    if (storedUser.username === username) {
      alert('Username already taken. Please choose another one.');
      return;
    }
    if (storedUser.email === email) {
      alert('Email already exists. Please use a different email.');
      return;
    }
  }

  const user = {
    username,
    email,
    password,
    role
  };

  localStorage.setItem('user', JSON.stringify(user));

  window.location.href = 'sign-in.html';
});
// username validation
function isValidUsername(username) {
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
  return usernamePattern.test(username);
}
// email validation function
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
