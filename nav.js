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
          <a href="user-profile.html" id="profile-img">
            <h1><i class='bx bx-user-circle'></i></h1>
            <div class="name-title">
              <h5>${username}</h5>
              <h6>Admin</h6>
            </div>
          </a>
        </li>
      </ul>
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
          <a href="user-profile.html" id="profile-img">
            <h1><i class='bx bx-user-circle'></i></h1>
            <div class="name-title">
              <h5>${username}</h5>
              <h6>User</h6>
            </div>
          </a>
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
  