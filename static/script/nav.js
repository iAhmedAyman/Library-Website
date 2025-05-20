window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const body = document.querySelector("body");

  const username = body.getAttribute("data-user");
  const role = body.getAttribute("data-role");

  const anonNav = `
      <ul id="navBar">
          <li id="logo"><img src="/static/images/logo.png" alt="logo"></li>
          <li id="pages">
              <a href="/homepage/" id="home">Home</a>
              <a href="/books/" id="books">Books</a>
              <a href="/about/" id="about-us">About Us</a>
          </li>
          <li id="profile">
              <a href="/sign-up/" id="profile-sign-up">Sign Up</a>
              <a href="/sign-in/" id="profile-sign-in">Sign In</a>
          </li>
      </ul>
  `;

  const adminNav = (username) => `
      <ul id="navBar">
          <li id="logo"><img src="/static/images/logo.png" alt="logo"></li>
          <li id="pages">
              <a href="/homepage/" id="home">Home</a>
              <a href="/books/" id="books">Books</a>
              <a href="/add_book/" id="add-book">Add Books</a>
              <a href="/about/" id="about-us">About Us</a>
          </li>
          <li id="profile">
              <div id="profile-img">
                  <h1><i class='bx bx-user-circle'></i></h1>
                  <div class="name-title">
                      <h5>${username}</h5>
                      <h6>Admin</h6>
                  </div>
              </div>
              <div id="profile-dropdown" class="dropdown-menu hidden">
                  <a href="/user-profile/">View Profile</a>
                  <a href="#" id="logout-btn">Logout</a>
              </div>
          </li>
      </ul>
  `;

  const userNav = (username) => `
      <ul id="navBar">
          <li id="logo"><img src="/static/images/logo.png" alt="logo"></li>
          <li id="pages">
              <a href="/homepage/" id="home">Home</a>
              <a href="/books/" id="books">Books</a>
              <a href="/my-books/" id="my-books">My Books</a>
              <a href="/about/" id="about-us">About Us</a>
          </li>
          <li id="profile">
              <div id="profile-img">
                  <h1><i class='bx bx-user-circle'></i></h1>
                  <div class="name-title">
                      <h5>${username}</h5>
                      <h6>User</h6>
                  </div>
              </div>
              <div id="profile-dropdown" class="dropdown-menu hidden">
                  <a href="/user-profile/">View Profile</a>
                  <a href="#" id="logout-btn">Logout</a>
              </div>
          </li>
      </ul>
  `;

  // Choose nav layout based on role
  if (username && role) {
      if (role === "admin") {
          nav.innerHTML = adminNav(username);
      } else {
          nav.innerHTML = userNav(username);
      }
  } else {
      nav.innerHTML = anonNav;
  }

  // Dropdown toggle
  document.addEventListener("click", (e) => {
      const profile = document.getElementById("profile-img");
      const dropdown = document.getElementById("profile-dropdown");
      if (!profile || !dropdown) return;

      if (profile.contains(e.target)) {
          dropdown.classList.toggle("hidden");
      } else if (!dropdown.contains(e.target)) {
          dropdown.classList.add("hidden");
      }
  });

  // Logout button logic
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          showLogoutConfirmation();
      });
  }

  function showLogoutConfirmation() {
      if (document.getElementById('confirm-box')) return;

      const confirmBox = document.createElement('div');
      confirmBox.id = 'confirm-box';
      confirmBox.style.position = 'fixed';
      confirmBox.style.top = '50%';
      confirmBox.style.left = '50%';
      confirmBox.style.transform = 'translate(-50%, -50%)';
      confirmBox.style.backgroundColor = '#fff';
      confirmBox.style.padding = '20px';
      confirmBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      confirmBox.style.borderRadius = '8px';
      confirmBox.style.zIndex = '1000';
      confirmBox.style.textAlign = 'center';
      confirmBox.style.width = '300px';

      confirmBox.innerHTML = `
          <p style="margin-bottom: 20px; font-size: 16px;">Are you sure you want to log out?</p>
          <button class="blue-button" id="confirm-yes" style="margin: 5px;">Yes</button>
          <button class="blue-button" id="confirm-no" style="margin: 5px;">No</button>
      `;

      document.body.appendChild(confirmBox);

      document.getElementById('confirm-yes').addEventListener('click', function () {
          window.location.href = '/log-out/';
      });

      document.getElementById('confirm-no').addEventListener('click', function () {
          confirmBox.remove();
      });
  }
});
