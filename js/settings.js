// js/settings.js
// Theme management
export function setTheme(themeName) {
    document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
    localStorage.setItem('taskmaster_theme', themeName);
}

// Dark mode management
export function setDarkMode(isEnabled) {
    document.body.classList.toggle('dark-mode', isEnabled);
    localStorage.setItem('taskmaster_dark_mode', isEnabled);
}

// Font management
export function setFontFamily(fontFamily) {
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('taskmaster_font_family', fontFamily);
}

export function setFontSize(fontSize) {
    document.body.style.fontSize = `${fontSize}px`;
    localStorage.setItem('taskmaster_font_size', fontSize);
}

// Setup settings listeners
export function setupSettingsListeners() {
    // Theme buttons
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            setDarkMode(e.target.checked);
        });
    }

    // Font family select
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', (e) => {
            setFontFamily(e.target.value);
        });
    }

    // Font size range
    const fontSizeRange = document.getElementById('fontSizeRange');
    if (fontSizeRange) {
        fontSizeRange.addEventListener('input', (e) => {
            setFontSize(e.target.value);
        });
        fontSizeRange.addEventListener('change', (e) => {
            localStorage.setItem('taskmaster_font_size', e.target.value);
        });
    }

    // Notifications toggle
    const notificationsToggle = document.getElementById('notificationsToggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            localStorage.setItem('taskmaster_notifications', e.target.checked);
            if (!e.target.checked) {
                // Clear all notifications
                import('./notifications.js').then(module => {
                    module.clearAllNotifications();
                });
            }
        });
    }

    // Default view select
    const defaultViewSelect = document.getElementById('defaultViewSelect');
    if (defaultViewSelect) {
        defaultViewSelect.addEventListener('change', (e) => {
            localStorage.setItem('taskmaster_default_view', e.target.value);
        });
    }
}

// Export/Import data
export function setupDataManagementListeners() {
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const importDataInput = document.getElementById('importDataInput');

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', handleExportData);
    }

    if (importDataBtn && importDataInput) {
        importDataBtn.addEventListener('click', () => {
            importDataInput.click();
        });
        importDataInput.addEventListener('change', handleImportData);
    }
}

function handleExportData() {
    const tasks = JSON.parse(localStorage.getItem('taskmaster_tasks')) || [];
    const deletedTasks = JSON.parse(localStorage.getItem('taskmaster_deleted_tasks')) || [];
    const currentUser = JSON.parse(localStorage.getItem('taskmaster_current_user'));

    const data = { tasks, deletedTasks, user: currentUser };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskmaster_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleImportData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.tasks && importedData.deletedTasks) {
                localStorage.setItem('taskmaster_tasks', JSON.stringify(importedData.tasks));
                localStorage.setItem('taskmaster_deleted_tasks', JSON.stringify(importedData.deletedTasks));
                alert('Data imported successfully!');
                window.location.reload();
            } else {
                alert('Invalid data file format.');
            }
        } catch (error) {
            alert('Failed to parse data file.');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}