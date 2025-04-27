document.addEventListener('DOMContentLoaded', () => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
        try {
            const { username, role } = JSON.parse(userJson);
            if (role === "admin") {
                // Create <a> element
                const addLink = document.createElement('a');
                addLink.href = 'add-book.html';

                // Create <button> element
                const addButton = document.createElement('button');
                addButton.className = 'add-button';
                addButton.textContent = '+';

                // Put the button inside the link
                addLink.appendChild(addButton);

                // Append to container (or wherever you want it)
                const container = document.querySelector('.container');
                container.appendChild(addLink);
            }
            
        } catch (e) {
          console.error("Invalid user data in storage:", e);
        }
      }
    
    
});