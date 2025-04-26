document.getElementById('signin-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  const loginEmail = emailInput.value.trim();
  const loginPassword = passwordInput.value;

  const storedUser = JSON.parse(localStorage.getItem('user'));

  clearErrors();

  if (
    storedUser &&
    storedUser.email === loginEmail &&
    storedUser.password === loginPassword
  ) {
    sessionStorage.setItem('loggedInRole', storedUser.role);
    sessionStorage.setItem('loggedInUsername', storedUser.username);
    window.location.href = 'homepage.html';
  } else {
    showFormError('Invalid email or password.');
  }
});

function showFormError(message) {
  let error = document.getElementById('form-error');

  if (!error) {
    error = document.createElement('div');
    error.id = 'form-error';
    error.style.color = 'red';
    error.style.fontSize = '14px';
    error.style.marginTop = '10px';
    error.style.textAlign = 'center';

    const submitButton = document.querySelector('#signin-form button[type="submit"]');
    if (submitButton) {
      submitButton.parentNode.insertBefore(error, submitButton.nextSibling);
    }
  }

  error.textContent = message;
}

function clearErrors() {
  const error = document.getElementById('form-error');
  if (error) {
    error.remove();
  }
}
