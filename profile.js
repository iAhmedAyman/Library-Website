// user-profile.js - Script for the user profile page

document.addEventListener('DOMContentLoaded', function() {
    console.log("User profile page loaded");
    
    // Load user profile data when page loads
    loadUserProfile();
    
    // Add event listener for the update password button
    const updatePasswordBtn = document.querySelector('.update-pw');
    if (updatePasswordBtn) {
      console.log("Update password button found, adding event listener");
      updatePasswordBtn.addEventListener('click', function(event) {
        event.preventDefault();
        updatePassword();
      });
    } else {
      console.error("Update password button not found");
    }
  
    // Prevent default form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // We'll handle updates with specific button clicks
      });
    } else {
      console.error("Profile form not found");
    }
  });
  
  // Function to load user data from local storage and populate the form
  function loadUserProfile() {
    console.log("Loading user profile data...");
    
    // Get user data from local storage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      console.log('No user data found in local storage');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      console.log("User data loaded:", user);
      
      // Update the username and role display in the header and profile section
      const nameElements = document.querySelectorAll('.name-title h5, .name-title h2');
      nameElements.forEach(element => {
        element.textContent = user.username || 'Username';
      });
      
      const roleElements = document.querySelectorAll('.name-title h6, .name-title h3');
      roleElements.forEach(element => {
        element.textContent = user.role || 'User';
      });
      
      // Populate the form fields
      const nameParts = (user.username || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Find the input fields directly
      const inputs = document.querySelectorAll('#profile-form input');
      
      // Loop through inputs and populate based on placeholder text
      inputs.forEach(input => {
        if (input.placeholder === 'Your name') {
          input.value = firstName;
          console.log("Set first name:", firstName);
        } else if (input.placeholder === 'Your last name') {
          input.value = lastName;
          console.log("Set last name:", lastName);
        } else if (input.placeholder === 'Examble@gmail.com') {
          input.value = user.email || '';
          console.log("Set email:", user.email);
        }
        // Don't set password fields for security
      });
      
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Function to update user password
  function updatePassword() {
    console.log("Update password function called");
    
    // Get current user data from local storage
    const userData = localStorage.getItem('user');
    if (!userData) {
      showMessage('No user data found. Please sign in again.', 'error');
      return;
    }
    
    const user = JSON.parse(userData);
    console.log("Retrieved user data:", user);
    
    // Get password inputs by selecting ALL password inputs and getting the first two
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    if (passwordInputs.length < 2) {
      console.error("Expected two password inputs, found:", passwordInputs.length);
      showMessage('Password fields not found', 'error');
      return;
    }
    
    const currentPassword = passwordInputs[0].value;
    const newPassword = passwordInputs[1].value;
    
    console.log("Current entered password:", currentPassword);
    console.log("Stored password:", user.password);
    
    // Check if fields are empty
    if (!currentPassword || !newPassword) {
      showMessage('Please fill in both password fields', 'error');
      return;
    }
    
    // Verify current password
    if (currentPassword !== user.password) {
      console.log("Password mismatch!");
      showMessage('Current password is incorrect', 'error');
      return;
    }
    
    // Update password in user object
    user.password = newPassword;
    
    // Save updated user object back to local storage
    localStorage.setItem('user', JSON.stringify(user));
    console.log("Password updated successfully. New user data:", user);
    
    // Show success message
    showMessage('Password updated successfully', 'success');
    
    // Clear password fields
    passwordInputs.forEach(input => {
      input.value = '';
    });
  }
  
  // Function to display messages to the user
  function showMessage(message, type) {
    console.log(`Showing message: "${message}" (${type})`);
    
    // Remove any existing message
    const existingMessage = document.querySelector('.message-container');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    messageContainer.style.padding = '10px';
    messageContainer.style.margin = '10px 0';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.textAlign = 'center';
    messageContainer.style.fontWeight = 'bold';
    messageContainer.style.width = '100%';
    messageContainer.style.maxWidth = '400px';
    messageContainer.style.marginTop = '15px';
    
    if (type === 'error') {
      messageContainer.style.backgroundColor = '#f8d7da';
      messageContainer.style.color = '#721c24';
      messageContainer.style.border = '1px solid #f5c6cb';
    } else {
      messageContainer.style.backgroundColor = '#d4edda';
      messageContainer.style.color = '#155724';
      messageContainer.style.border = '1px solid #c3e6cb';
    }
    
    messageContainer.textContent = message;
    
    // Insert after the update password button
    const updateBtn = document.querySelector('.update-pw');
    if (updateBtn && updateBtn.parentNode) {
      updateBtn.parentNode.insertBefore(messageContainer, updateBtn.nextSibling);
    } else {
      // Fallback - add to the form
      const form = document.getElementById('profile-form');
      if (form) {
        form.appendChild(messageContainer);
      }
    }
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      messageContainer.remove();
    }, 5000);
  }



// Sign-out
document.addEventListener('DOMContentLoaded', function() {
    const signOutBtn = document.querySelector('#profile #sign-out-btn') || 
                      document.querySelector('.sign-out-btn') || 
                      document.querySelector('[id*="sign-out"]') ||
                      document.querySelector('[class*="sign-out"]');
    
    if (signOutBtn) {
      console.log("Found sign-out button, adding event listener");
      signOutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        signOut();
      });
    } else {
      console.log("No sign-out button found on the page");
    }
  });
  
  // Function to handle sign-out process
  function signOut() {
    // Ask for confirmation
    const confirmSignOut = confirm("Are you sure you want to sign out?");
    
    if (confirmSignOut) {
      console.log("Signing out user...");
      
      // Keep user data but mark as signed out
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.isSignedIn = false;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Redirect to sign-in page
      window.location.href = 'sign-in.html';
    }
  }