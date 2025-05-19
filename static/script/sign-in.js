clearErrors();
document.getElementById('login-email').addEventListener('focus', clearErrors);
document.getElementById('login-password').addEventListener('focus', clearErrors);

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
    submitButton.parentNode.insertBefore(error, submitButton.nextSibling);
  }
  error.textContent = message;
}

function clearErrors() {
  const error = document.getElementById('form-error');
  if (error) error.remove();
}