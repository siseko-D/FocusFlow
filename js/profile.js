// js/profile.js
import { getCurrentUser, updateCounts } from "./utils.js";

// Load profile data
export function loadProfile() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const profileUsername = document.getElementById("profileUsername");
  const profileEmail = document.getElementById("profileEmail");
  const profileJoinDate = document.getElementById("profileJoinDate");
  const profilePicture = document.getElementById("profilePicture");
  const characterSelectionContainer = document.getElementById(
    "characterSelectionContainer",
  );

  if (profileUsername) profileUsername.textContent = currentUser.username;
  if (profileEmail) profileEmail.textContent = currentUser.email;
  if (profileJoinDate)
    profileJoinDate.textContent = new Date(
      currentUser.createdAt,
    ).toLocaleDateString();

  updateCounts();

  // Load saved character or show selection
  const savedCharacter = localStorage.getItem("taskmaster_character");
  if (savedCharacter && profilePicture && characterSelectionContainer) {
    profilePicture.src = savedCharacter;
    profilePicture.style.display = "block";
    characterSelectionContainer.style.display = "none";
  } else if (profilePicture && characterSelectionContainer) {
    profilePicture.style.display = "none";
    characterSelectionContainer.style.display = "flex";
  }
}

// Setup character selection
export function setupCharacterSelection() {
  const characterAvatars = document.querySelectorAll(".character-avatar");
  const profilePicture = document.getElementById("profilePicture");
  const characterSelectionContainer = document.getElementById(
    "characterSelectionContainer",
  );
  const changeCharacterBtn = document.getElementById("changeCharacterBtn");

  if (characterAvatars) {
    characterAvatars.forEach((avatar) => {
      avatar.addEventListener("click", () => {
        const characterSrc = avatar.src;
        if (profilePicture && characterSelectionContainer) {
          profilePicture.src = characterSrc;
          localStorage.setItem("taskmaster_character", characterSrc);
          profilePicture.style.display = "block";
          characterSelectionContainer.style.display = "none";
        }
      });
    });
  }

  if (changeCharacterBtn && profilePicture && characterSelectionContainer) {
    changeCharacterBtn.addEventListener("click", () => {
      profilePicture.style.display = "none";
      characterSelectionContainer.style.display = "flex";
    });
  }
}

// Setup logout buttons
export function setupLogoutListeners() {
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutProfileBtn = document.getElementById("logoutProfileBtn");

  const logout = () => {
    localStorage.removeItem("taskmaster_current_user");
    window.location.href = "index.html";
  };

  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  if (logoutProfileBtn) logoutProfileBtn.addEventListener("click", logout);
}
