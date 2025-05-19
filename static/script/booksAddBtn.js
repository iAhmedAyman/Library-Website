document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector("body");

  const username = body.getAttribute("data-user");
  const role = body.getAttribute("data-role");

      try {
          if (role === "admin") {
              // Create <a> element
              const addLink = document.createElement('a');
              addLink.href = '/add_book/';

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
});