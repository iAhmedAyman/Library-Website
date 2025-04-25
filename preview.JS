document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(b => b.id === bookId);

    if (book) {
        document.querySelector(".name-title h1").innerText = book.title;
        document.querySelector(".name-title p").innerText = book.author;
        document.querySelector(".flag-categ span:last-child").innerHTML = `<i class='bx bx-purchase-tag'></i>${book.category}`;
        document.getElementById("description-preview").innerText = book.description;
    } else {
        alert("Book not found!");
    }
});
