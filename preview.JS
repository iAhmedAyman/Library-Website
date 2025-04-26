document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);

    const borrowBtn = document.getElementById("borrow-btn");
    const favouriteBtn = document.getElementById("favourite-btn");

    if (book) {
        document.getElementById("cover").src = book.cover;
        document.querySelector(".name-title h1").innerText = book.title;
        document.querySelector(".name-title p").innerText = book.author;
        document.querySelector(".category").innerHTML = `<i class='bx bx-purchase-tag'></i>${book.category}`;
        document.getElementById("description-preview").innerText = book.description;
    } else {
        alert("Book not found!");
    }

    let borrowedBooks = JSON.parse(localStorage.getItem('borrowed')) || [];
    let favouriteBooks = JSON.parse(localStorage.getItem('favourite')) || [];

    borrowBtn.addEventListener('click', function() {
        // Check if the book already exists
        const bookTemp = borrowedBooks.find(b => b.id === book.id);

        if (!bookTemp) {
            // Add book to the user's borrowed books
            borrowedBooks.push(book);

            // Save to localStorage
            localStorage.setItem('borrowed', JSON.stringify(borrowedBooks));
            console.log("borrow success");
        }
        
    });

    favouriteBtn.addEventListener('click', function() {
        // Check if the book already exists
        const bookTemp = favouriteBooks.find(b => b.id === book.id);

        if (!bookTemp) {
            // Add book to the user's favourite books
            favouriteBooks.push(book);

            // Save to localStorage
            localStorage.setItem('favourite', JSON.stringify(favouriteBooks));
            console.log("fav success");
        }  
    });
});

