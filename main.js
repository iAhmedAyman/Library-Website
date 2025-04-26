
// add-book JS code
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const titleInput = document.querySelector('input[placeholder="Book title"]');
    const authorInput = document.querySelector('input[placeholder="Author name"]');
    const categoryInput = document.querySelector('input[placeholder="Book category"]');
    const idInput = document.querySelector('input[placeholder="Book ID"]');
    const descriptionInput = document.getElementById('description-input');
    const addButton = document.querySelector('.blue-button');

    // Cover
    const coverOverlay = document.querySelector('#cover-preview .edit-overlay');
    const fileInput = document.getElementById('cover-upload');
    const coverImage = document.querySelector('#cover-preview img');

    // Clicking on the overlay opens the hidden file input
    coverOverlay.addEventListener('click', () => {
        fileInput.click();
    });

    // When a file is selected
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                const imageData = reader.result;
                coverImage.src = imageData; // Show the new image
                console.log(coverImage.src);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Initialize books array from localStorage or create empty array if none exists
    let books = JSON.parse(localStorage.getItem('books')) || [];
    
    // Function to generate a unique ID
    function generateUniqueId() {
        return 'book-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    
    // Function to validate form
    function validateForm() {
        if (!titleInput.value.trim()) {
            alert('Please enter a book title');
            return false;
        }
        if (!authorInput.value.trim()) {
            alert('Please enter an author name');
            return false;
        }
        if (!categoryInput.value.trim()) {
            alert('Please enter a category');
            return false;
        }
        return true;
    }
    
    // Function to show feedback
    function showFeedback(message, isSuccess = true) {
        // Create a feedback element if it doesn't exist
        let feedback = document.getElementById('feedback-message');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'feedback-message';
            document.querySelector('.vertical-flex').appendChild(feedback);
        }
        
        // Style based on success or failure
        feedback.style.padding = '10px';
        feedback.style.marginTop = '10px';
        feedback.style.borderRadius = '4px';
        feedback.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
        feedback.style.color = isSuccess ? '#155724' : '#721c24';
        
        feedback.textContent = message;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
        
        feedback.style.display = 'block';
    }
    
    // Function to save book
    function saveBook() {
        if (!validateForm()) return;

        console.log(coverImage.src);
        
        // Create book object
        const book = {
            id: idInput.value.trim() || generateUniqueId(),
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            category: categoryInput.value.trim(),
            description: descriptionInput.value.trim(),
            dateAdded: new Date().toISOString(),
            cover: coverImage.src
        };
        
        // Check if ID already exists (except when it's auto-generated)
        if (idInput.value.trim()) {
            const existingBook = books.find(b => b.id === book.id);
            if (existingBook) {
                showFeedback(`Book with ID ${book.id} already exists!`, false);
                return;
            }
        }
        
        // Add to books array
        books.push(book);
        
        // Save to localStorage
        localStorage.setItem('books', JSON.stringify(books));
        
        // Show success message
        showFeedback(`Book "${book.title}" added successfully!`);
        
        // Clear form
        titleInput.value = '';
        authorInput.value = '';
        categoryInput.value = '';
        idInput.value = '';
        descriptionInput.value = '';
        window.location.href = `preview.html?id=${book.id}`;
    }
    
    // Add event listener to the Add Book button
    addButton.addEventListener('click', saveBook);
    
    // Optional: Create a function to display all books (for testing)
    window.displayBooks = function() {
        console.table(JSON.parse(localStorage.getItem('books')) || []);
    };
});

// Function to load book cards data form localStorage
function loadBooks() {
    const bookContainer = document.querySelector(".books");
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // clear static content
    bookContainer.innerHTML = ""; 

    books.forEach(book => {
      const card = document.createElement("div");
      card.classList.add("book-card");
      const userJson = localStorage.getItem("user");

      const userPreview = `
      <img src="${book.cover}" alt="Book Cover" class="book-img">
        <a href="preview.html?id=${book.id}" class="book-overlay">
          <div class="book-header">
            <div class="left">
              <h3>${book.title}</h3>
              <p class="author">${book.author}</p>
            </div>
            <div class="right">
              <span class="status ${book.status}">${book.status}</span>
              <span class="category"><i class='bx bx-purchase-tag'></i>${book.category}</span>
            </div>
          </div>
          <p class="description">Description: ${book.description}</p>
        </a>
      `;

      const adminPreview = `
      <img src="${book.cover}" alt="Book Cover" class="book-img">
        <a href="previewEdit.html?id=${book.id}" class="book-overlay">
          <div class="book-header">
            <div class="left">
              <h3>${book.title}</h3>
              <p class="author">${book.author}</p>
            </div>
            <div class="right">
              <span class="status ${book.status}">${book.status}</span>
              <span class="category"><i class='bx bx-purchase-tag'></i>${book.category}</span>
            </div>
          </div>
          <p class="description">Description: ${book.description}</p>
        </a>
      `;

      if (!userJson) {
        card.innerHTML = userPreview;
      } 
      else {
        try {
            const { username, role } = JSON.parse(userJson);
            if (role === "admin") {
                card.innerHTML = adminPreview;
            } else {
                card.innerHTML = userPreview;
            }
        } catch (e) {
            console.error("Invalid user data in storage:", e);
            nav.innerHTML = anonNav;
        }
      }

    
      bookContainer.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", loadBooks);
