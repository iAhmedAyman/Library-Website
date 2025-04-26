document.addEventListener('DOMContentLoaded', function() {
  const titleInput = document.querySelector('input[placeholder="Book title"]');
  const authorInput = document.querySelector('input[placeholder="Author name"]');
  const categoryInput = document.querySelector('input[placeholder="Book category"]');
  const idInput = document.querySelector('input[placeholder="Book ID"]');
  const descriptionInput = document.getElementById('description-input');
  const addButton = document.querySelector('.blue-button');

  // Set max length constraints
  const MAX_TITLE_LENGTH = 50;
  const MAX_AUTHOR_LENGTH = 40;
  const MIN_DESCRIPTION_LENGTH = 20;

  // Apply maxlength attributes to inputs
  titleInput.setAttribute('maxlength', MAX_TITLE_LENGTH);
  authorInput.setAttribute('maxlength', MAX_AUTHOR_LENGTH);
  
  // Add character counters
  createCharCounter(titleInput, MAX_TITLE_LENGTH);
  createCharCounter(authorInput, MAX_AUTHOR_LENGTH);
  createCharCounter(descriptionInput, null, MIN_DESCRIPTION_LENGTH);

  // Function to create and update character counters
  function createCharCounter(inputElement, maxLength, minLength = null) {
      const counterDiv = document.createElement('div');
      counterDiv.className = 'char-counter';
      counterDiv.style.fontSize = '12px';
      counterDiv.style.color = '#666';
      counterDiv.style.textAlign = 'right';
      counterDiv.style.marginTop = '2px';
      
      // Insert counter after the input element
      inputElement.parentNode.insertBefore(counterDiv, inputElement.nextSibling);
      
      // Update counter function
      function updateCounter() {
          const currentLength = inputElement.value.length;
          
          if (maxLength) {
              counterDiv.textContent = `${currentLength}/${maxLength}`;
              
              // Visual feedback as user approaches the limit
              if (currentLength >= maxLength * 0.9) {
                  counterDiv.style.color = 'orange';
              } else {
                  counterDiv.style.color = '#666';
              }
              
              if (currentLength === maxLength) {
                  counterDiv.style.color = 'red';
              }
          }
          
          if (minLength !== null) {
              counterDiv.textContent = `${currentLength} characters (min: ${minLength})`;
              
              if (currentLength < minLength) {
                  counterDiv.style.color = 'red';
              } else {
                  counterDiv.style.color = 'green';
              }
          }
      }
      
      updateCounter();
      
      inputElement.addEventListener('input', updateCounter);
  }

  const coverOverlay = document.querySelector('#cover-preview .edit-overlay');
  const fileInput = document.getElementById('cover-upload');
  const coverImage = document.querySelector('#cover-preview img');

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
              coverImage.src = imageData;
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
          showFeedback('Please enter a book title', false);
          return false;
      }
      if (!authorInput.value.trim()) {
          showFeedback('Please enter an author name', false);
          return false;
      }
      if (!categoryInput.value.trim()) {
          showFeedback('Please enter a category', false);
          return false;
      }
      
      // Validate description length
      if (descriptionInput.value.trim().length < MIN_DESCRIPTION_LENGTH) {
          showFeedback(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters long`, false);
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
      
      // Hide after 3 seconds
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

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const filterIcon = document.getElementById("filterIcon");
    const filterMenu = document.getElementById("filterMenu");
    // Load books initially
    loadBooks();

    // Search filter
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchValue = this.value.trim();
            loadBooks(searchValue);
        });
    }
    
    if (filterIcon && filterMenu) {
        // Toggle menu visibility
        filterIcon.addEventListener("click", () => {
            filterMenu.style.display = (filterMenu.style.display === "none") ? "block" : "none";
        });
    
        // Add click listeners for each filter choice
        filterMenu.addEventListener("click", function (e) {
            const filterType = e.target.dataset.filterType;
            if (!filterType) return;
    
            const userInput = prompt(`Enter ${filterType === "category" ? "Category" : "Author"} to filter:`);
    
            if (userInput) {
                loadBooks("", filterType, userInput.trim().toLowerCase());
            }
    
            // Hide the menu after selection
            filterMenu.style.display = "none";
        });
    }
    
});

function loadBooks(searchText = "", filterType = "", filterValue = "") {
    const bookContainer = document.querySelector(".books");
    const books = JSON.parse(localStorage.getItem("books")) || [];

    bookContainer.innerHTML = "";

    const filteredBooks = books.filter(book => {
        const matchesSearch = (
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author.toLowerCase().includes(searchText.toLowerCase()) ||
            book.category.toLowerCase().includes(searchText.toLowerCase())
        );

        let matchesFilter = true;

        if (filterType === "category") {
            matchesFilter = book.category.toLowerCase() === filterValue;
        } else if (filterType === "author") {
            matchesFilter = book.author.toLowerCase() === filterValue;
        }

        return matchesSearch && matchesFilter;
    });

    filteredBooks.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <img src="${book.cover || 'default-cover.jpg'}" alt="Book Cover" class="book-img">
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

        bookContainer.appendChild(card);
    });
}
