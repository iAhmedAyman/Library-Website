document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm').value;
  const role = document.querySelector('input[name="role"]:checked').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
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
