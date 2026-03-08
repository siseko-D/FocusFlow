// js/auth.js
// Toggle between login and register forms
document.addEventListener("DOMContentLoaded", function () {
  setupAuthToggles();
  setupPasswordToggles();
  setupAuthForms();
});

function setupAuthToggles() {
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const loginContent = document.getElementById("login-content");
  const registerContent = document.getElementById("register-content");

  if (showRegister) {
    showRegister.addEventListener("click", function (e) {
      e.preventDefault();
      loginContent.style.display = "none";
      registerContent.style.display = "block";
    });
  }

  if (showLogin) {
    showLogin.addEventListener("click", function (e) {
      e.preventDefault();
      registerContent.style.display = "none";
      loginContent.style.display = "block";
    });
  }
}

function setupPasswordToggles() {
  setupPasswordToggle("loginToggle", "loginPassword");
  setupPasswordToggle("registerToggle", "registerPassword");
}

function setupPasswordToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);

  if (toggle && input) {
    toggle.addEventListener("click", function () {
      if (input.type === "password") {
        input.type = "text";
        toggle.textContent = "🙈";
      } else {
        input.type = "password";
        toggle.textContent = "👁️";
      }
    });
  }
}

function setupAuthForms() {
  // Registration form
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration);
  }

  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

function handleRegistration(e) {
  e.preventDefault();
  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const registerError = document.getElementById("registerError");

  // Get existing users
  const users = JSON.parse(localStorage.getItem("taskmaster_users")) || [];

  // Simple validation
  if (password.length < 6) {
    registerError.textContent = "Password must be at least 6 characters.";
    registerError.style.display = "block";
    return;
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    registerError.textContent = "This email is already registered.";
    registerError.style.display = "block";
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    username: username,
    email: email,
    password: password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("taskmaster_users", JSON.stringify(users));
  localStorage.setItem("taskmaster_current_user", JSON.stringify(newUser));

  registerError.textContent = "";
  registerError.style.display = "none";

  // Redirect to the main app page
  window.location.href = "taskmaster-app.html";
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginError = document.getElementById("loginError");

  const users = JSON.parse(localStorage.getItem("taskmaster_users")) || [];

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("taskmaster_current_user", JSON.stringify(user));
    loginError.textContent = "";
    loginError.style.display = "none";
    window.location.href = "taskmaster-app.html";
  } else {
    loginError.textContent = "Invalid email or password.";
    loginError.style.display = "block";
  }
}
 