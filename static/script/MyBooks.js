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
    
        let booksContainer = borrowedBooksSection.querySelector(".books");
        
        // Clear existing content
        if (borrowedBooksSection.querySelector(".books")) {
            borrowedBooksSection.querySelector(".books").innerHTML = "";
        } else {
            // Create books container if it doesn't exist
            booksContainer = document.createElement("div");
            booksContainer.className = "books";
            borrowedBooksSection.appendChild(booksContainer);
        }

        fetch("/api/borrowed_books/")
        .then(response => response.json())
        .then(borrowedBooks => {
            if (borrowedBooks.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className = "empty-message";
                emptyMessage.textContent = "You haven't borrowed any books yet.";
                emptyMessage.style.textAlign = "center";
                emptyMessage.style.padding = "20px";
                booksContainer.appendChild(emptyMessage);
                return;
            }

            borrowedBooks.forEach(book => {
                const card = createBookCard(book);
                booksContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching borrowed books:", error);
            const errorMessage = document.createElement("p");
            errorMessage.className = "empty-message";
            errorMessage.textContent = "Failed to load borrowed books.";
            errorMessage.style.color = "red";
            errorMessage.style.textAlign = "center";
            errorMessage.style.padding = "20px";
            booksContainer.appendChild(errorMessage);
        });
        
    }
    
    // === Function to load favorite books ===
    function loadFavoriteBooks() {
        const favouriteContainer = document.querySelectorAll(".container")[1];
        const favouriteBooksSection = favouriteContainer.querySelector(".books-section") || favouriteContainer;
    
        let booksContainer = favouriteBooksSection.querySelector(".books");
        
        // Clear existing content
        if (favouriteBooksSection.querySelector(".books")) {
            favouriteBooksSection.querySelector(".books").innerHTML = "";
        } else {
            // Create books container if it doesn't exist
            booksContainer = document.createElement("div");
            booksContainer.className = "books";
            favouriteBooksSection.appendChild(booksContainer);
        }

        fetch("/api/favourite_books/")
        .then(response => response.json())
        .then(favouriteBooks => {
            if (favouriteBooks.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className = "empty-message";
                emptyMessage.textContent = "You haven't favourite any books yet.";
                emptyMessage.style.textAlign = "center";
                emptyMessage.style.padding = "20px";
                booksContainer.appendChild(emptyMessage);
                return;
            }

            favouriteBooks.forEach(book => {
                const card = createBookCard(book);
                booksContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching favourite books:", error);
            const errorMessage = document.createElement("p");
            errorMessage.className = "empty-message";
            errorMessage.textContent = "Failed to load favourite books.";
            errorMessage.style.color = "red";
            errorMessage.style.textAlign = "center";
            errorMessage.style.padding = "20px";
            booksContainer.appendChild(errorMessage);
        });
    }
    
    // === Function to create book card ===
    function createBookCard(book) {
        const card = document.createElement("div");
        card.classList.add("book-card");

        const body = document.querySelector("body");
        const role = body.getAttribute("data-role");

        const previewUrl = role === "admin"? `/add_book/preview/${book.id}/`: `/books/preview/${book.id}/`;
        
        card.innerHTML = `
               <img src="${book.cover}" alt="Book Cover" class="book-img">
                <a href="${previewUrl}" class="book-overlay">
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
        
        return card;
    }

    // SETUP SEARCH FOR BOTH SECTIONS
    const sections = [
        {
            container: document.querySelectorAll(".container")[0],
            input: document.getElementById("barrowedSearchInput"),
            filterIcon: document.getElementById("barrowedFilterIcon"),
            filterMenu: document.getElementById("barrowedFilterMenu"),
            popup: document.getElementById("barrowedFilterPopup"),
            popupInput: document.getElementById("barrowedPopupInput"),
            popupSelect: document.getElementById("barrowedPopupSelect"),
            applyBtn: document.getElementById("barrowedApplyFilter"),
            filterLabel: document.getElementById("barrowedFilterLabel"),
            closePopup: document.getElementById("barrowedClosePopup")
        },
        {
            container: document.querySelectorAll(".container")[1],
            input: document.getElementById("favouriteSearchInput"),
            filterIcon: document.getElementById("favouriteFilterIcon"),
            filterMenu: document.getElementById("favouriteFilterMenu"),
            popup: document.getElementById("favouriteFilterPopup"),
            popupInput: document.getElementById("favouritePopupInput"),
            popupSelect: document.getElementById("favouritePopupSelect"),
            applyBtn: document.getElementById("favouriteApplyFilter"),
            filterLabel: document.getElementById("favouriteFilterLabel"),
            closePopup: document.getElementById("favouriteClosePopup")
        }
    ];

    sections.forEach(section => {
        const { container, input, filterIcon, filterMenu, popup, popupInput, popupSelect, applyBtn, filterLabel, closePopup } = section;
        
        // Get the filter container within the current section
        const filterContainer = container.querySelector(".filter");

        let currentFilterType = "";

        let selectedFilterType = "";

        // When user clicks a filter option from the dropdown
        filterMenu.querySelectorAll("div").forEach(option => {
            option.addEventListener("click", () => {
                selectedFilterType = option.getAttribute("data-filter-type");
                popupInput.style.display = "none";
                popupSelect.style.display = "none";

                if (selectedFilterType === "availability") {
                    filterLabel.textContent = "Select Availability:";
                    popupSelect.style.display = "block";
                    popupSelect.value = "";
                } else {
                    const cap = selectedFilterType.charAt(0).toUpperCase() + selectedFilterType.slice(1);
                    filterLabel.textContent = `Enter ${cap}:`;
                    popupInput.style.display = "block";
                    popupInput.value = "";
                }

                popup.style.display = "block";
                filterMenu.style.display = "none";
            });
        });

        // When user applies the selected filter
        applyBtn.addEventListener("click", () => {
            let filterValue = "";
            if (selectedFilterType === "availability") {
                filterValue = popupSelect.value.toLowerCase().trim();
            } else {
                filterValue = popupInput.value.toLowerCase().trim();
            }

            popup.style.display = "none";
            filterBooks(container, input, selectedFilterType, filterValue);
        });

        // Toggle filter menu
        filterIcon.addEventListener("click", () => {
            filterMenu.style.display = (filterMenu.style.display === "none" || filterMenu.style.display === "") ? "block" : "none";
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!filterContainer.contains(e.target) && !filterMenu.contains(e.target)) {
                filterMenu.style.display = "none";
            }
        });

        // Live search
        input.addEventListener("input", () => {
            filterBooks(container, input);
        });
    });
});