document.addEventListener("DOMContentLoaded", () => {
    // === Utility function to filter cards ===
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
                matchesFilter = card.querySelector(`.${filterType}`)?.textContent.toLowerCase().includes(filterValue);
            }

            if (matchesSearch && matchesFilter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // === SETUP SEARCH FOR BOTH SECTIONS ===
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
            filterIcon: document.getElementById("favouriteSilterIcon"),
            filterMenu: document.getElementById("favouriteSilterMenu")
        }
    ];

    sections.forEach(section => {
        const { container, input, filterIcon, filterMenu } = section;

        // Toggle filter menu
        filterIcon.addEventListener("click", () => {
            filterMenu.style.display = filterMenu.style.display === "none" ? "block" : "none";
        });

        // Filter menu options
        filterMenu.querySelectorAll("div").forEach(option => {
            option.addEventListener("click", () => {
                const filterType = option.getAttribute("data-filter-type");
                const userInput = prompt(`Enter ${filterType} name:`);
                if (userInput === null || userInput.trim().toLowerCase() === "cancel") {
                    filterMenu.style.display = "none"; // Hide menu if user cancels
                    return;
                }
                const filterValue = prompt(`Enter ${filterType} name:`).toLowerCase(); // Ask user input
                filterBooks(container, input, filterType, filterValue);
            });
        });

        // Live search
        input.addEventListener("input", () => {
            filterBooks(container, input); // Only search, no filter
        });
    });
});

