// js/app.js
import { initializeData, getCurrentUser, updateCounts } from './utils.js';
import { renderTasks, setupTaskListListeners, setupFilterListeners, addTask } from './tasks.js';
import { setupSettingsListeners, setupDataManagementListeners, setTheme, setDarkMode, setFontFamily, setFontSize } from './settings.js';
import { loadProfile, setupCharacterSelection, setupLogoutListeners } from './profile.js';
import { createNotification, clearAllNotifications } from './notifications.js';

// Global variables (will be populated from utils)
let tasks = [];
let deletedTasks = [];

// DOM Elements
const navbarToggle = document.getElementById('navbarToggle');
const navbarLinks = document.querySelector('.navbar-links');
const navLinks = document.querySelectorAll('.nav-link');
const addTaskBtn = document.getElementById('addTaskBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const confirmDeleteInput = document.getElementById('confirmDeleteInput');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const messagePopup = document.getElementById('messagePopup');
const deleteAccountModal = document.getElementById('deleteAccountModal');

// Navigation functions
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}

// Modal functions
function showMessagePopup() {
    if (messagePopup) messagePopup.classList.add('show');
}

function hideMessagePopup() {
    if (messagePopup) messagePopup.classList.remove('show');
}

function showDeleteAccountModal() {
    if (deleteAccountModal) deleteAccountModal.classList.add('show');
}

function hideDeleteAccountModal() {
    if (deleteAccountModal) deleteAccountModal.classList.remove('show');
}

// Make modal functions global for onclick handlers
window.hideMessagePopup = hideMessagePopup;
window.hideDeleteAccountModal = hideDeleteAccountModal;

// Load saved settings
function loadSavedSettings() {
    const savedTheme = localStorage.getItem('taskmaster_theme') || 'default';
    setTheme(savedTheme);

    const savedDarkMode = JSON.parse(localStorage.getItem('taskmaster_dark_mode'));
    if (savedDarkMode !== null) {
        setDarkMode(savedDarkMode);
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.checked = savedDarkMode;
    }

    const savedFontFamily = localStorage.getItem('taskmaster_font_family');
    if (savedFontFamily) {
        setFontFamily(savedFontFamily);
        const fontFamilySelect = document.getElementById('fontFamilySelect');
        if (fontFamilySelect) fontFamilySelect.value = savedFontFamily;
    }

    const savedFontSize = localStorage.getItem('taskmaster_font_size');
    if (savedFontSize) {
        setFontSize(savedFontSize);
        const fontSizeRange = document.getElementById('fontSizeRange');
        if (fontSizeRange) fontSizeRange.value = savedFontSize;
    }

    const savedNotifications = localStorage.getItem('taskmaster_notifications');
    if (savedNotifications !== null) {
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) notificationsToggle.checked = JSON.parse(savedNotifications);
    }

    const savedDefaultView = localStorage.getItem('taskmaster_default_view');
    if (savedDefaultView) {
        const defaultViewSelect = document.getElementById('defaultViewSelect');
        if (defaultViewSelect) defaultViewSelect.value = savedDefaultView;
        
        // Set current filter
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => btn.classList.remove('active'));
        const defaultBtn = document.querySelector(`[data-filter="${savedDefaultView}"]`);
        if (defaultBtn) defaultBtn.classList.add('active');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize data
    const data = initializeData();
    tasks = data.tasks;
    deletedTasks = data.deletedTasks;

    // Load saved settings
    loadSavedSettings();

    // Setup navigation
    if (navbarToggle && navbarLinks) {
        navbarToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Setup task management
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
    }
    
    setupTaskListListeners();
    setupFilterListeners();

    // Setup settings
    setupSettingsListeners();
    setupDataManagementListeners();

    // Setup profile
    loadProfile();
    setupCharacterSelection();
    setupLogoutListeners();

    // Setup modals
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', showMessagePopup);
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', showDeleteAccountModal);
    }

    if (confirmDeleteInput && confirmDeleteBtn) {
        confirmDeleteInput.addEventListener('input', (e) => {
            confirmDeleteBtn.disabled = e.target.value !== 'DELETE';
        });

        confirmDeleteBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Show tasks section by default
    showSection('tasks');

    // Render tasks
    renderTasks();
    updateCounts();

    // Re-schedule notifications
    const notificationsToggle = document.getElementById('notificationsToggle');
    if (notificationsToggle && notificationsToggle.checked) {
        tasks.forEach(task => {
            if (task.notificationTime > 0 || task.bookingDate) {
                createNotification(task);
            }
        });
    }
});