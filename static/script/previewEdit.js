// Set max length constraints
const MAX_TITLE_LENGTH = 50;
const MAX_AUTHOR_LENGTH = 40;
const MIN_DESCRIPTION_LENGTH = 20;

// Cover
const coverOverlay = document.querySelector('#cover-preview .edit-overlay');
const fileInput = document.getElementById('cover-upload');
const coverImage = document.querySelector('#cover-preview img');

// Clicking on the overlay opens the hidden file input
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
            coverImage.src = imageData; // Show the new image
            console.log(coverImage.src);
            saveChanges();
        };
        reader.readAsDataURL(file);
    }
});

// title and author Inline Editing
const titleOverlay = document.getElementById('title-edit');
const titleElement = document.querySelector('.name-title .edit-info h1');
const authorOverlay = document.getElementById('author-edit');
const authorElement = document.querySelector('.name-title .edit-info p');

titleOverlay.addEventListener('click', () => {
    makeEditable(titleElement, titleOverlay, MAX_TITLE_LENGTH);
});

authorOverlay.addEventListener('click', () => {
    makeEditable(authorElement, authorOverlay, MAX_AUTHOR_LENGTH);
});

// CATEGORY Inline Editing
const categoryOverlay = document.querySelector('.flag-categ .edit-info .edit-overlay');
const categoryElement = document.querySelector('.flag-categ .category');

categoryOverlay.addEventListener('click', () => {
    makeEditable(categoryElement, categoryOverlay, MAX_TITLE_LENGTH, true);
});

// description Inline Editing
const descriptionOverlay = document.querySelector('.description .edit-info .edit-overlay');
const descriptionElement = document.getElementById('description-preview');

descriptionOverlay.addEventListener('click', () => {
    makeEditable(descriptionElement, descriptionOverlay, MIN_DESCRIPTION_LENGTH);
});

// Function to turn an element into an input field
function makeEditable(element, overlay, limit, hasIcon = false) {
    const oldValue = hasIcon ? element.innerText.trim().replace(/^.*?\s/, '') : element.innerText.trim(); 
    
    if (element.id === 'description-preview') {
        input = document.createElement("textarea");
        input.style.resize = "none";
        input.style.boxSizing = "border-box";
    } else {
        input = document.createElement("input");
        input.type = "text";
    }

    input.value = oldValue;
    // match the style
    const computedStyle = window.getComputedStyle(element);
    input.style.fontFamily = computedStyle.fontFamily;
    input.style.fontSize = computedStyle.fontSize;
    input.style.fontWeight = computedStyle.fontWeight;
    input.style.color = computedStyle.color;
    input.style.background = "transparent";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.padding = computedStyle.padding;
    input.style.margin = computedStyle.margin;
    input.style.width = computedStyle.width;
    input.style.height = computedStyle.height;
    
    if (element.id != 'description-preview') {
        input.setAttribute('maxlength', limit);
    }


    element.replaceWith(input);
    input.focus();

    // Hide the overlay while editing
    overlay.style.display = "none";

    input.addEventListener("blur", function() {
        overlay.style.display = "flex";
        saveInput(input, element, hasIcon);
    });
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            input.blur(); // trigger save on Enter
        }
    });
}

async function saveInput(input, originalElement, hasIcon = false) {
    const newValue = input.value.trim();

    // Validate input
    if (originalElement.id === 'description-preview' && newValue.length < MIN_DESCRIPTION_LENGTH) {
        showFeedback(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`, false);
        input.focus();
        return;
    }

    if (newValue === "") {
        showFeedback("Input cannot be empty.", false);
        input.focus();
        return;
    }

    // Temporarily update element for submission
    if (hasIcon) {
        originalElement.innerHTML = `<i class='bx bx-purchase-tag'></i>${newValue}`;
    } else {
        originalElement.innerText = newValue;
    }

    // Replace input visually to reflect new value
    input.replaceWith(originalElement);

    try {
        const success = await saveChanges();  // Await server confirmation

        if (success) {
            showFeedback("Changes saved successfully.", true);
        } else {
            throw new Error("Backend failed");
        }
    } catch (error) {
        // Revert UI
        originalElement.replaceWith(input);
        showFeedback("Failed to save changes. Please try again.", false);
        input.focus();
    }
}




async function saveChanges() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    const form = document.getElementById('book-update-form');
    const formData = new FormData(form);

    // Set updated values
    formData.set('title', document.getElementById('title').innerText.trim());
    formData.set('author', document.getElementById('author').innerText.trim());
    formData.set('category', document.getElementById('category').innerText.trim().replace(/^.*?\s/, ''));
    formData.set('description', document.getElementById('description-preview').innerText.trim());

    const coverInput = document.getElementById('cover-upload');
    if (coverInput.files.length > 0) {
        formData.set('cover', coverInput.files[0]);
    }

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: formData,
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            showFeedback("Changes saved!", true);
            return true;
        } else {
            showFeedback("Failed to save changes: " + JSON.stringify(result.errors || result.message), false);
            return false;
        }
    } catch (error) {
        showFeedback("Error saving changes: " + error.message, false);
        return false;
    }
}




// CSRF helper 
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
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