document.addEventListener('DOMContentLoaded', function() {
  const titleInput = document.querySelector('input[placeholder="Book title"]');
  const authorInput = document.querySelector('input[placeholder="Author name"]');
  const categoryInput = document.querySelector('input[placeholder="Book category"]');
  const idInput = document.querySelector('input[placeholder="Book ID"]');
  const descriptionInput = document.getElementById('description-input');
  const addButton = document.querySelector('.blue-button');

  const MAX_TITLE_LENGTH = 50;
  const MAX_AUTHOR_LENGTH = 40;
  const MIN_DESCRIPTION_LENGTH = 20;

  titleInput.setAttribute('maxlength', MAX_TITLE_LENGTH);
  authorInput.setAttribute('maxlength', MAX_AUTHOR_LENGTH);
  createCharCounter(titleInput, MAX_TITLE_LENGTH);
  createCharCounter(authorInput, MAX_AUTHOR_LENGTH);
  createCharCounter(descriptionInput, null, MIN_DESCRIPTION_LENGTH);

  function createCharCounter(inputElement, maxLength, minLength = null) {
    const counterDiv = document.createElement('div');
    counterDiv.className = 'char-counter';
    counterDiv.style.fontSize = '12px';
    counterDiv.style.color = '#666';
    counterDiv.style.textAlign = 'right';
    counterDiv.style.marginTop = '2px';
    inputElement.parentNode.insertBefore(counterDiv, inputElement.nextSibling);

    function updateCounter() {
      const currentLength = inputElement.value.length;
      if (maxLength) {
        counterDiv.textContent = `${currentLength}/${maxLength}`;
        counterDiv.style.color = currentLength >= maxLength * 0.9 ? 'orange' : '#666';
        if (currentLength === maxLength) counterDiv.style.color = 'red';
      }
      if (minLength !== null) {
        counterDiv.textContent = `${currentLength} characters (min: ${minLength})`;
        counterDiv.style.color = currentLength < minLength ? 'red' : 'green';
      }
    }

    updateCounter();
    inputElement.addEventListener('input', updateCounter);
  }

  const coverOverlay = document.querySelector('#cover-preview .edit-overlay');
  const fileInput = document.getElementById('cover-upload');
  const coverImage = document.querySelector('#cover-preview img');

  coverOverlay.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function() {
        coverImage.src = reader.result;
        console.log(coverImage.src);
      };
      reader.readAsDataURL(file);
    }
  });

  let books = JSON.parse(localStorage.getItem('books')) || [];

  function generateUniqueId() {
    return 'book-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function validateForm() {
    if (!titleInput.value.trim()) return showFeedback('Please enter a book title', false), false;
    if (!authorInput.value.trim()) return showFeedback('Please enter an author name', false), false;
    if (!categoryInput.value.trim()) return showFeedback('Please enter a category', false), false;
    if (descriptionInput.value.trim().length < MIN_DESCRIPTION_LENGTH)
      return showFeedback(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters long`, false), false;
    return true;
  }

  function showFeedback(message, isSuccess = true) {
    let feedback = document.getElementById('feedback-message');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'feedback-message';
      document.querySelector('.vertical-flex').appendChild(feedback);
    }
    feedback.style = `padding:10px;margin-top:10px;border-radius:4px;background-color:${isSuccess ? '#d4edda' : '#f8d7da'};color:${isSuccess ? '#155724' : '#721c24'}`;
    feedback.textContent = message;
    feedback.style.display = 'block';
    setTimeout(() => { feedback.style.display = 'none'; }, 3000);
  }

  function saveBook() {
    if (!validateForm()) return;
    const book = {
      id: idInput.value.trim() || generateUniqueId(),
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      category: categoryInput.value.trim(),
      description: descriptionInput.value.trim(),
      dateAdded: new Date().toISOString(),
      cover: coverImage.src,
      available: true
    };
    if (idInput.value.trim() && books.some(b => b.id === book.id)) {
      return showFeedback(`Book with ID ${book.id} already exists!`, false);
    }
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    showFeedback(`Book "${book.title}" added successfully!`);
    titleInput.value = '';
    authorInput.value = '';
    categoryInput.value = '';
    idInput.value = '';
    descriptionInput.value = '';
    window.location.href = `/add_book/preview/${book.id}/`;
  }

  addButton.addEventListener('click', saveBook);
  window.displayBooks = () => console.table(JSON.parse(localStorage.getItem('books')) || []);
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const filterIcon = document.getElementById("filterIcon");
  const filterMenu = document.getElementById("filterMenu");
  loadBooks();

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      loadBooks(this.value.trim());
    });
  }

  if (filterIcon && filterMenu) {
    filterIcon.addEventListener("click", () => {
      filterMenu.style.display = (filterMenu.style.display === "none") ? "block" : "none";
    });

    const filter = document.querySelector(".filter");
    const filterBox = document.getElementById("filterMenu");
    document.addEventListener('click', (e) => {
      if (!filter.contains(e.target) && !filterBox.contains(e.target)) {
        filterMenu.style.display = "none";
      }
    });

    filterMenu.addEventListener("click", function (e) {
      const filterType = e.target.dataset.filterType;
      if (!filterType) return;
      let promptText = {
        category: "Enter Category to filter:",
        author: "Enter Author to filter:",
        availability: "Enter Availability (e.g., Available, Checked Out) to filter:"
      }[filterType];

      const userInput = prompt(promptText);
      if (userInput) {
        loadBooks("", filterType, userInput.trim().toLowerCase());
      }
      filterMenu.style.display = "none";
    });
  }
});

function loadBooks(searchText = "", filterType = "", filterValue = "") {
  const bookContainer = document.querySelector(".books");

  fetch("/api/books/")
    .then(response => response.json())
    .then(books => {
      bookContainer.innerHTML = "";
      if (books.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No books have been added yet.";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "20px";
        bookContainer.appendChild(emptyMessage);
        return;
      }

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
        } else if (filterType === "availability") {
          const status = book.available ? "available" : "borrowed";
          matchesFilter = status === filterValue;
        }
        return matchesSearch && matchesFilter;
      });

      filteredBooks.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("book-card");
        const userJson = localStorage.getItem("user");

        const userPreview = `
          <img src="${book.cover}" alt="Book Cover" class="book-img">
          <a href="/add_book/preview/${book.id}/" class="book-overlay">
            <div class="book-header">
              <div class="left">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
              </div>
              <div class="right">
                <span class="status ${book.available ? "available" : "borrowed"}">${book.available ? "Available" : "Borrowed"}</span>
                <span class="category"><i class='bx bx-purchase-tag'></i>${book.category}</span>
              </div>
            </div>
            <p class="description">Description: ${book.description.slice(0, 140)}${book.description.length > 140 ? "..." : ""}</p>
          </a>`;

        const adminPreview = userPreview; // same link for now

        try {
          const { role } = userJson ? JSON.parse(userJson) : {};
          card.innerHTML = role === "admin" ? adminPreview : userPreview;
        } catch (e) {
          card.innerHTML = userPreview;
        }

        bookContainer.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading books from server:", err));
}

const learnMoreButton = document.getElementById('box-button-next');
if (learnMoreButton) {
  learnMoreButton.addEventListener('click', function () {
    const learnMoreSection = document.getElementById('learn-more');
    if (learnMoreSection) {
      learnMoreSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
