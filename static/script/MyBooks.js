document.addEventListener("DOMContentLoaded", () => {
    // Load borrowed and favorite books from localStorage
    loadBorrowedBooks();
    loadFavoriteBooks();
    
    // Utility function to filter cards
    function filterBooks(container, searchInput, filterType = null, filterValue = null) {
        const cards = container.querySelectorAll(".book-card");
        const query = searchInput.value.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const author = card.querySelector(".author").textContent.toLowerCase();
            const category = card.querySelector(".category").textContent.toLowerCase();

            let matchesSearch = (
                title.includes(query) ||
                author.includes(query) ||
                category.includes(query)
            );

            let matchesFilter = true;
            if (filterType && filterValue) {
                const cardValue = card.querySelector(`.${filterType}`)?.textContent.toLowerCase().trim();
                matchesFilter = cardValue === filterValue; // Require exact match
            }

            if (matchesSearch && matchesFilter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Function to load borrowed books
    function loadBorrowedBooks() {
        const borrowedContainer = document.querySelectorAll(".container")[0];
        const borrowedBooksSection = borrowedContainer.querySelector(".books-section") || borrowedContainer;
        const borrowedBooks = JSON.parse(localStorage.getItem('borrowed')) || [];
        
        // Clear existing content
        if (borrowedBooksSection.querySelector(".books")) {
            borrowedBooksSection.querySelector(".books").innerHTML = "";
        } else {
            // Create books container if it doesn't exist
            const booksContainer = document.createElement("div");
            booksContainer.className = "books";
            borrowedBooksSection.appendChild(booksContainer);
        }
        
        const booksContainer = borrowedBooksSection.querySelector(".books");
        
        // Display message if no borrowed books
        if (borrowedBooks.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "You haven't borrowed any books yet.";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.padding = "20px";
            booksContainer.appendChild(emptyMessage);
            return;
        }
        
        // Create book cards for borrowed books
        borrowedBooks.forEach(book => {
            const card = createBookCard(book);
            booksContainer.appendChild(card);
        });
    }
    
    // === Function to load favorite books ===
    function loadFavoriteBooks() {
        const favoriteContainer = document.querySelectorAll(".container")[1];
        const favoriteBooksSection = favoriteContainer.querySelector(".books-section") || favoriteContainer;
        const favoriteBooks = JSON.parse(localStorage.getItem('favourite')) || [];
        
        // Clear existing content
        if (favoriteBooksSection.querySelector(".books")) {
            favoriteBooksSection.querySelector(".books").innerHTML = "";
        } else {
            // Create books container if it doesn't exist
            const booksContainer = document.createElement("div");
            booksContainer.className = "books";
            favoriteBooksSection.appendChild(booksContainer);
        }
        
        const booksContainer = favoriteBooksSection.querySelector(".books");
        
        // Display message if no favorite books
        if (favoriteBooks.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "You haven't added any books to favorites yet.";
            emptyMessage.style.textAlign = "center";
            emptyMessage.style.padding = "20px";
            booksContainer.appendChild(emptyMessage);
            return;
        }
        
        // Create book cards for favorite books
        favoriteBooks.forEach(book => {
            const card = createBookCard(book);
            booksContainer.appendChild(card);
        });
    }
    
    // === Function to create book card ===
    function createBookCard(book) {
        const card = document.createElement("div");
        card.classList.add("book-card");
        
        card.innerHTML = `
            <img src="${book.cover}" alt="Book Cover" class="book-img">
            <a href="preview.html?id=${book.id}" class="book-overlay">
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
            </a>
        `;
        
        return card;
    }

    // SETUP SEARCH FOR BOTH SECTIONS
    const sections = [
        {
            container: document.querySelectorAll(".container")[0],
            input: document.getElementById("barrowedSearchInput"),
            filterIcon: document.getElementById("barrowedFilterIcon"),
            filterMenu: document.getElementById("barrowedFilterMenu")
        },
        {
            container: document.querySelectorAll(".container")[1],
            input: document.getElementById("favouriteSearchInput"),
            filterIcon: document.getElementById("favouriteFilterIcon"),
            filterMenu: document.getElementById("favouriteFilterMenu")
        }
    ];

    sections.forEach(section => {
        const { container, input, filterIcon, filterMenu } = section;
        
        // Get the filter container within the current section
        const filterContainer = container.querySelector(".filter");

        // Toggle filter menu
        filterIcon.addEventListener("click", () => {
            filterMenu.style.display = filterMenu.style.display === "none" ? "block" : "none";
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!filterContainer.contains(e.target) && !filterMenu.contains(e.target)) {
                filterMenu.style.display = "none";
            }
        });

        // Filter menu options
        filterMenu.querySelectorAll("div").forEach(option => {
            option.addEventListener("click", () => {
                const filterType = option.getAttribute("data-filter-type");
                const userInput = prompt(`Enter full ${filterType} name:`);
                
                if (!userInput || userInput.trim().toLowerCase() === "cancel") {
                    filterMenu.style.display = "none";
                    return;
                }

                const filterValue = userInput.trim().toLowerCase();
                filterBooks(container, input, filterType, filterValue);
                filterMenu.style.display = "none";
            });
        });

        // Live search
        input.addEventListener("input", () => {
            filterBooks(container, input);
        });
    });
});