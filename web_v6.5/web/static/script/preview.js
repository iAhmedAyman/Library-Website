document.addEventListener("DOMContentLoaded", function () {
    // Get the book ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = document.body.dataset.bookId;

    // Get data directly from DOM (rendered by Django)
    const borrowBtn = document.getElementById("borrow-btn");
    const favouriteBtn = document.getElementById("favourite-btn");
    const favouriteIcon = document.getElementById("favourite-icon");

    const book = {
        id: bookId,
        title: document.querySelector(".name-title h1").innerText,
        author: document.querySelector(".name-title p").innerText,
        category: document.querySelector(".category").innerText.replace("Category", "").trim(),
        description: document.getElementById("description-preview").innerText,
        cover: document.getElementById("cover").src,
        available: document.getElementById("availability").innerText.trim().toLowerCase() === "available"
    };

    // Fallback if no ID is provided
    if (!bookId) {
        alert("No book ID provided in URL!");
        return;
    }

    // Get borrowed & favourite books from localStorage
    let borrowedBooks = JSON.parse(localStorage.getItem('borrowed')) || [];
    let favouriteBooks = JSON.parse(localStorage.getItem('favourite')) || [];

    let isFavourite = favouriteBooks.some(b => b.id === book.id);
    let isBorrowed = borrowedBooks.some(b => b.id === book.id);

    updateFavouriteIcon();
    updateBorrowButton();
    updateAvailability();

    borrowBtn.addEventListener('click', function () {
        const borrowedIndex = borrowedBooks.findIndex(b => b.id === book.id);
        const favIndex = favouriteBooks.findIndex(b => b.id === book.id);

        if (borrowedIndex === -1) {
            borrowedBooks.push(book);
            isBorrowed = true;
            book.available = false;
            if (favIndex !== -1) favouriteBooks[favIndex].available = false;
        } else {
            borrowedBooks.splice(borrowedIndex, 1);
            isBorrowed = false;
            book.available = true;
            if (favIndex !== -1) favouriteBooks[favIndex].available = true;
        }

        localStorage.setItem('borrowed', JSON.stringify(borrowedBooks));
        localStorage.setItem('favourite', JSON.stringify(favouriteBooks));
        updateBorrowButton();
        updateAvailability();
    });

    favouriteBtn.addEventListener('click', function () {
        const favIndex = favouriteBooks.findIndex(b => b.id === book.id);

        if (favIndex === -1) {
            favouriteBooks.push(book);
            isFavourite = true;
        } else {
            favouriteBooks.splice(favIndex, 1);
            isFavourite = false;
        }

        localStorage.setItem('favourite', JSON.stringify(favouriteBooks));
        updateFavouriteIcon();
    });

    function updateFavouriteIcon() {
        favouriteIcon.className = isFavourite ? 'bx bxs-star' : 'bx bx-star';
        favouriteIcon.style.color = isFavourite ? "#ffc107" : "#007bff";
    }

    function updateBorrowButton() {
        borrowBtn.textContent = isBorrowed ? "Return" : "Borrow";
    }

    function updateAvailability() {
        const availability = document.getElementById("availability");
        availability.textContent = book.available ? "Available" : "Borrowed";
        availability.classList.toggle('available-preview', book.available);
        availability.classList.toggle('borrowed-preview', !book.available);
    }
});
