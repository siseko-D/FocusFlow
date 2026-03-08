// js/notifications.js
import { tasks, deletedTasks, notificationTimeouts, saveTasks } from './utils.js';

// Clear all pending notifications
export function clearAllNotifications() {
    notificationTimeouts.forEach(timeout => {
        clearTimeout(timeout.id);
    });
    notificationTimeouts.length = 0;
    console.log("Cleared all pending notifications");
}

// Clear notifications for a specific task
export function clearTaskNotification(taskId) {
    const index = notificationTimeouts.findIndex(notification => notification.taskId === taskId);
    if (index !== -1) {
        clearTimeout(notificationTimeouts[index].id);
        notificationTimeouts.splice(index, 1);
    }
}

// Create notification for a task
export function createNotification(task) {
    // Clear any existing notification for this task
    clearTaskNotification(task.id);

    const notificationsToggle = document.getElementById('notificationsToggle');
    if (!notificationsToggle || !notificationsToggle.checked) return;

    // Handle scheduled date notifications
    if (task.bookingDate) {
        const scheduledTime = new Date(task.bookingDate).getTime();
        const currentTime = new Date().getTime();
        const timeUntilNotification = scheduledTime - currentTime;

        if (timeUntilNotification > 0) {
            const timeoutId = setTimeout(() => {
                showNotification(task.title);
            }, timeUntilNotification);

            notificationTimeouts.push({
                id: timeoutId,
                taskId: task.id
            });
        }
    }

    // Handle "notify me in X minutes" notifications
    const notificationTime = parseInt(task.notificationTime);
    if (notificationTime && notificationTime > 0) {
        const timeInMs = notificationTime * 60 * 1000;

        const timeoutId = setTimeout(() => {
            showNotification(task.title);
        }, timeInMs);

        notificationTimeouts.push({
            id: timeoutId,
            taskId: task.id
        });
    }
}

// Show notification popup
export function showNotification(taskName) {
    try {
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (!notificationsToggle || !notificationsToggle.checked) return;

        const notificationPopup = document.getElementById('notificationPopup');
        const notificationTaskName = document.getElementById('notificationTaskName');
        
        if (notificationPopup && notificationTaskName) {
            notificationTaskName.textContent = taskName;
            notificationPopup.classList.add('visible');
            
            setTimeout(() => {
                hideNotification();
            }, 5000);
        }
    } catch (error) {
        console.error("Error showing notification:", error);
    }
}

// Hide notification popup
export function hideNotification() {
    const notificationPopup = document.getElementById('notificationPopup');
    if (notificationPopup) {
        notificationPopup.classList.remove('visible');
    }
}

// Make hideNotification available globally for onclick handlers
window.hideNotification = hideNotification;