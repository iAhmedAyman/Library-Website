document.getElementById('signup-form').addEventListener('submit', function(event) {
  clearErrors(); 

  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm');
  const roleInput = document.querySelector('input[name="role"]:checked');

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
  const role = roleInput ? roleInput.value : null;

  let hasError = false;

  if (!isValidUsername(username)) {
    showFieldError(usernameInput, 'Username must be 3–20 characters and only contain letters, numbers, and underscores.');
    hasError = true;
  }

  if (!isValidEmail(email)) {
    showFieldError(emailInput, 'Invalid email format.');
    hasError = true;
  }

  if (password.length < 6) {
    showFieldError(passwordInput, 'Password must be at least 6 characters.');
    hasError = true;
  }

  if (password !== confirmPassword) {
    showFieldError(confirmInput, 'Passwords do not match.');
    hasError = true;
  }

  if (!role) {
    alert('Please select a role.');
    hasError = true;
  }

  if (hasError) {
    event.preventDefault(); // Only prevent submission if there's an error
  }
});

// Validation helpers
function isValidUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(inputElement, message) {
  let error = document.createElement('div');
  error.className = 'field-error';
  error.style.color = 'red';
  error.style.fontSize = '12px';
  error.style.marginTop = '5px';
  error.textContent = message;
  inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(error => error.remove());
}