window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  let userJson = localStorage.getItem("user");

  if (!userJson) {
      const body = document.querySelector("body");
      const username = body.getAttribute("data-user");
      const role = body.getAttribute("data-role");

      if (username && role) {
          const user = { username, role, isSignedIn: true };
          localStorage.setItem("user", JSON.stringify(user));
          userJson = JSON.stringify(user);
      }
  }

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
      </li>
    </ul>
    <div id="profile-dropdown" class="dropdown-menu hidden">
      <a href="/user-profile/">View Profile</a>
      <a href="#" id="logout-btn">Logout</a>
    </div>
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

  // Build nav bar based on user role
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

  // Dropdown toggle for profile menu
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

  // Logout confirmation and clearing user data
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

      document.getElementById('confirm-yes').addEventListener('click', function() {
          localStorage.removeItem('user');
          window.location.href = '/log-out/';
      });

      document.getElementById('confirm-no').addEventListener('click', function() {
          confirmBox.remove();
      });
  }
});
