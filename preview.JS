document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const bookIndexInBooks = books.findIndex(b => b.id === bookId);
    const book = books[bookIndexInBooks];

    const borrowBtn = document.getElementById("borrow-btn");
    const favouriteBtn = document.getElementById("favourite-btn");
    const favouriteIcon = document.getElementById("favourite-icon");
    const availableStatus = document.getElementById("available-status");

    if (book) {
        document.getElementById("cover").src = book.cover;
        document.querySelector(".name-title h1").innerText = book.title;
        document.querySelector(".name-title p").innerText = book.author;
        document.querySelector(".category").innerHTML = `<i class='bx bx-purchase-tag'></i>${book.category}`;
        document.getElementById("description-preview").innerText = book.description;
        if (book.available) {
            document.getElementById("availability").classList.add('available');
            document.getElementById("availability").classList.remove('borrowed');
        }
        else {
            document.getElementById("availability").classList.remove('available');
            document.getElementById("availability").classList.add('borrowed');
        }
        document.getElementById("availability").innerHTML = book.available? "Available" : "Borrowed"
    } else {
        alert("Book not found!");
        return;
    }

    let borrowedBooks = JSON.parse(localStorage.getItem('borrowed')) || [];
    let favouriteBooks = JSON.parse(localStorage.getItem('favourite')) || [];

    let isFavourite = favouriteBooks.some(b => b.id === book.id);
    let isBorrowed = borrowedBooks.some(b => b.id === book.id);

    updateFavouriteIcon();
    updateBorrowButton();
    updateAvailability();

    borrowBtn.addEventListener('click', function() {
        borrowedBooks = JSON.parse(localStorage.getItem('borrowed')) || [];
        const borrowedIndex = borrowedBooks.findIndex(b => b.id === book.id);

        if (borrowedIndex === -1) {
            // Borrow the book
            borrowedBooks.push(book);
            isBorrowed = true;
            book.available = false; // <-- UPDATE availability
            console.log("Borrowed successfully");
        } else {
            // Return the book
            borrowedBooks.splice(borrowedIndex, 1);
            isBorrowed = false;
            book.available = true; // <-- UPDATE availability
            console.log("Returned successfully");
        }

        // Update books array
        books[bookIndexInBooks] = book;

        localStorage.setItem('borrowed', JSON.stringify(borrowedBooks));
        localStorage.setItem('books', JSON.stringify(books));

        updateBorrowButton();
        updateAvailability();
    });

    favouriteBtn.addEventListener('click', function() {
        favouriteBooks = JSON.parse(localStorage.getItem('favourite')) || [];
        const favIndex = favouriteBooks.findIndex(b => b.id === book.id);

        if (favIndex === -1) {
            favouriteBooks.push(book);
            isFavourite = true;
            console.log("Added to favourites");
        } else {
            favouriteBooks.splice(favIndex, 1);
            isFavourite = false;
            console.log("Removed from favourites");
        }

        localStorage.setItem('favourite', JSON.stringify(favouriteBooks));
        updateFavouriteIcon();
    });

    function updateFavouriteIcon() {
        if (isFavourite) {
            favouriteIcon.className = 'bx bxs-star';
            favouriteIcon.style.color = "#ffc107";
        } else {
            favouriteIcon.className = 'bx bx-star';
            favouriteIcon.style.color = "#007bff";
        }
    }

    function updateBorrowButton() {
        if (isBorrowed) {
            borrowBtn.textContent = "Return";
        } else {
            borrowBtn.textContent = "Borrow";
        }
    }

    function updateAvailability() {
        if (availableStatus) {
            availableStatus.textContent = book.available ? "Available" : "Not Available";
            availableStatus.style.color = book.available ? "green" : "red";
        }
    }
});
