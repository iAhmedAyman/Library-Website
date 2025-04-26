// nav.js
window.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const userJson = localStorage.getItem("user");
  
    const anonNav = `
      <ul id="navBar">
        <li id="logo"><img src="logo.png" alt="logo"></li>
        <li id="pages">
          <a href="homepage.html" id="home">Home</a>
          <a href="books.html" id="books">Books</a>
          <a href="About-us.html" id="about-us">About Us</a>
        </li>
        <li id="profile">
          <a href="sign-up.html" id="profile-sign-up">Sign Up</a>
          <a href="sign-in.html" id="profile-sign-in">Sign In</a>
        </li>
      </ul>
    `;
  
    const adminNav = (username) => `
      <ul id="navBar">
        <li id="logo"><img src="logo.png" alt="logo"></li>
        <li id="pages">
          <a href="homepage.html" id="home">Home</a>
          <a href="booksAdd.html" id="books">Books</a>
          <a href="About-us.html" id="about-us">About Us</a>
        </li>
        <li id="profile">
          <div id="profile-img">
            <h1><i class='bx bx-user-circle'></i></h1>
            <div class="name-title">
              <h5>${username}</h5>
              <h6>Admin</h6>
            </div>
          </div>
        </li>
      </ul>
	  <!-- Dropdown Menu -->
	  <div id="profile-dropdown" class="dropdown-menu hidden">
		  <a href="user-profile.html">View Profile</a>
		  <a href="#" id="logout-btn">Logout</a>
	  </div>
    `;
  
    const userNav = (username) => `
      <ul id="navBar">
        <li id="logo"><img src="logo.png" alt="logo"></li>
        <li id="pages">
          <a href="homepage.html" id="home">Home</a>
          <a href="books.html" id="books">Books</a>
          <a href="MyBooks.html" id="my-books">My Books</a>
          <a href="About-us.html" id="about-us">About Us</a>
        </li>
        <li id="profile">
          <div id="profile-img">
            <h1><i class='bx bx-user-circle'></i></h1>
            <div class="name-title">
              <h5>${username}</h5>
              <h6>User</h6>
            </div>
          </div>
          <!-- Dropdown Menu -->
          <div id="profile-dropdown" class="dropdown-menu hidden">
              <a href="user-profile.html">View Profile</a>
              <a href="#" id="logout-btn">Logout</a>
          </div>
        </li>
      </ul>
    `;
  
    if (!userJson) {
      nav.innerHTML = anonNav;
    } else {
      try {
        const { username, role } = JSON.parse(userJson);
        if (role === "admin") {
          nav.innerHTML = adminNav(username);
        } else {
          nav.innerHTML = userNav(username);
        }
      } catch (e) {
        console.error("Invalid user data in storage:", e);
        nav.innerHTML = anonNav;
      }
    }
  });
  

window.addEventListener("DOMContentLoaded", () => {
    const profile = document.getElementById('profile-img');
    const dropdown = document.getElementById('profile-dropdown');

    // Make drop down visible
    profile.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Profile clicked!");  // Debugging
        dropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profile.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

	// Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
		console.log("Signing out user...");
		
		// Keep user data but mark as signed out
		const userData = localStorage.getItem('user');
		if (userData) {
			const user = JSON.parse(userData);
			user.isSignedIn = false;
			localStorage.setItem('user', JSON.stringify(user));
		}
		
		// Redirect to sign-in page
		window.location.href = 'sign-in.html';
        });
    }
});
