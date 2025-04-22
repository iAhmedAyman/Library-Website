document.getElementById('signin-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const loginEmail = document.getElementById('login-email').value.trim();
  const loginPassword = document.getElementById('login-password').value;

  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (
    storedUser &&
    storedUser.email === loginEmail &&
    storedUser.password === loginPassword
  ) {
    sessionStorage.setItem('loggedInRole', storedUser.role);
    sessionStorage.setItem('loggedInUsername', storedUser.username);
    window.location.href = 'homepage.html';
  } else {
    alert('Invalid email or password!');
  }
});
