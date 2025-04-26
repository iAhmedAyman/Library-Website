document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();

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

  if (!isValidUsername(username)) {
    showFieldError(usernameInput, 'Username must be 3-20 characters long and only contain letters, numbers, and underscores.');
    return;
  }

  if (!isValidEmail(email)) {
    showFieldError(emailInput, 'Invalid email format.');
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser) {
    if (storedUser.username === username) {
      showFieldError(usernameInput, 'Username already taken.');
      return;
    }
    if (storedUser.email === email) {
      showFieldError(emailInput, 'Email already registered.');
      return;
    }
  }

  if (password.length < 6) {
    showFieldError(passwordInput, 'Password must be at least 6 characters.');
    return;
  }

  if (password !== confirmPassword) {
    showFieldError(confirmInput, 'Passwords do not match.');
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

// username validation
function isValidUsername(username) {
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
  return usernamePattern.test(username);
}

// email validation
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// show error under input field
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
  const previousErrors = document.querySelectorAll('.field-error');
  previousErrors.forEach(error => error.remove());
}
