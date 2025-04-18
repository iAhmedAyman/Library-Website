
// add-book JS code
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const titleInput = document.querySelector('input[placeholder="Book title"]');
    const authorInput = document.querySelector('input[placeholder="Author name"]');
    const categoryInput = document.querySelector('input[placeholder="Book category"]');
    const idInput = document.querySelector('input[placeholder="Book ID"]');
    const descriptionInput = document.getElementById('description-input');
    const addButton = document.querySelector('.blue-button');
    
    // Initialize books array from localStorage or create empty array if none exists
    let books = JSON.parse(localStorage.getItem('books')) || [];
    
    // Function to generate a unique ID
    function generateUniqueId() {
        return 'book-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    
    // Function to validate form
    function validateForm() {
        if (!titleInput.value.trim()) {
            alert('Please enter a book title');
            return false;
        }
        if (!authorInput.value.trim()) {
            alert('Please enter an author name');
            return false;
        }
        if (!categoryInput.value.trim()) {
            alert('Please enter a category');
            return false;
        }
        return true;
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
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
        
        feedback.style.display = 'block';
    }
    
    // Function to save book
    function saveBook() {
        if (!validateForm()) return;
        
        // Create book object
        const book = {
            id: idInput.value.trim() || generateUniqueId(),
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            category: categoryInput.value.trim(),
            description: descriptionInput.value.trim(),
            dateAdded: new Date().toISOString()
        };
        
        // Check if ID already exists (except when it's auto-generated)
        if (idInput.value.trim()) {
            const existingBook = books.find(b => b.id === book.id);
            if (existingBook) {
                showFeedback(`Book with ID ${book.id} already exists!`, false);
                return;
            }
        }
        
        // Add to books array
        books.push(book);
        
        // Save to localStorage
        localStorage.setItem('books', JSON.stringify(books));
        
        // Show success message
        showFeedback(`Book "${book.title}" added successfully!`);
        
        // Clear form
        titleInput.value = '';
        authorInput.value = '';
        categoryInput.value = '';
        idInput.value = '';
        descriptionInput.value = '';
    }
    
    // Add event listener to the Add Book button
    addButton.addEventListener('click', saveBook);
    
    // Optional: Create a function to display all books (for testing)
    window.displayBooks = function() {
        console.table(JSON.parse(localStorage.getItem('books')) || []);
    };
});