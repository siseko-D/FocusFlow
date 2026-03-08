// js/utils.js
// Global variables
let tasks = [];
let deletedTasks = [];
let currentFilter = "active";
let notificationTimeouts = [];

// Initialize data from localStorage
export function initializeData() {
  tasks = JSON.parse(localStorage.getItem("taskmaster_tasks")) || [];
  deletedTasks =
    JSON.parse(localStorage.getItem("taskmaster_deleted_tasks")) || [];
  return { tasks, deletedTasks };
}

// Save tasks to localStorage
export function saveTasks() {
  localStorage.setItem("taskmaster_tasks", JSON.stringify(tasks));
  localStorage.setItem(
    "taskmaster_deleted_tasks",
    JSON.stringify(deletedTasks),
  );
}

// Get current user
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("taskmaster_current_user"));
}

// Update counts in UI
export function updateCounts() {
  const activeCount = document.getElementById("activeCount");
  const completedCount = document.getElementById("completedCount");
  const deletedCount = document.getElementById("deletedCount");
  const tasksCreatedCount = document.getElementById("tasksCreatedCount");
  const tasksCompletedCount = document.getElementById("tasksCompletedCount");

  if (activeCount)
    activeCount.textContent = tasks.filter((task) => !task.completed).length;
  if (completedCount)
    completedCount.textContent = tasks.filter((task) => task.completed).length;
  if (deletedCount) deletedCount.textContent = deletedTasks.length;
  if (tasksCreatedCount)
    tasksCreatedCount.textContent = tasks.length + deletedTasks.length;
  if (tasksCompletedCount)
    tasksCompletedCount.textContent = tasks.filter(
      (task) => task.completed,
    ).length;
}

// Export functions for use in other files
export { tasks, deletedTasks, currentFilter, notificationTimeouts };
