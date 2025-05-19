document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector("body");

    const bookId = body.getAttribute("data-book-id");

    // Get data directly from DOM (rendered by Django)
    const borrowBtn = document.getElementById("borrow-btn");
    const favouriteBtn = document.getElementById("favourite-btn");
    const favouriteIcon = document.getElementById("favourite-icon");
    const availability = document.getElementById("availability");

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

    let isFavourite = favouriteIcon.classList.contains("bxs-star");
    let isBorrowed = availability.innerText.trim().toLowerCase() !== "available";

    updateFavouriteIcon();
    updateBorrowButton();
    updateAvailability();

    borrowBtn.addEventListener('click', function () {
        fetch(`/borrow/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            isBorrowed = (data.status === 'borrowed');
            updateBorrowButton();
            updateAvailability();
        })
        .catch(error => console.error('Borrow error:', error));
    });

    favouriteBtn.addEventListener('click', function () {
        fetch(`/favourite/${bookId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            isFavourite = (data.status === 'added');
            updateFavouriteIcon();
        })
        .catch(error => console.error('Favourite error:', error));
    });

    function updateFavouriteIcon() {
        favouriteIcon.className = isFavourite ? 'bx bxs-star' : 'bx bx-star';
        favouriteIcon.style.color = isFavourite ? "#ffc107" : "#007bff";
    }

    function updateBorrowButton() {
        borrowBtn.textContent = isBorrowed ? "Return" : "Borrow";
    }

    function updateAvailability() {
        availability.textContent = isBorrowed ? "Borrowed" : "Available";
        availability.classList.toggle('available-preview', !isBorrowed);
        availability.classList.toggle('borrowed-preview', isBorrowed);
    }

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.split('=')[1]);
            }
        }
        return null;
    }
});
