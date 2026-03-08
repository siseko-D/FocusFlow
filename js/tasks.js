// js/tasks.js
import { tasks, deletedTasks, currentFilter, notificationTimeouts } from './utils.js';
import { saveTasks, updateCounts, getCurrentUser } from './utils.js';
import { createNotification, clearTaskNotification } from './notifications.js';

// Render tasks based on current filter
export function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.innerHTML = '';

    if (currentFilter === 'deleted') {
        if (deletedTasks.length === 0) {
            taskList.innerHTML = '<div class="no-tasks-message">No deleted tasks.</div>';
        } else {
            deletedTasks.forEach(task => {
                const li = createDeletedTaskElement(task);
                taskList.appendChild(li);
            });
        }
    } else {
        const filteredTasks = tasks.filter(task =>
            currentFilter === 'active' ? !task.completed : task.completed
        );

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<div class="no-tasks-message">No ${currentFilter} tasks.</div>`;
        } else {
            filteredTasks.forEach(task => {
                const li = createTaskElement(task);
                taskList.appendChild(li);
            });
        }
    }
}

// Create task element for active/completed tasks
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
        <div class="task-info">
            <input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <div class="task-text-container">
                <span class="task-title">
                    <span class="priority-indicator priority-${task.priority || 'medium'}"></span>
                    ${task.title}
                </span>
                <span class="task-description">${task.description || ''}</span>
                ${task.bookingDate ? `
                    <span class="task-booking">
                        <i class="far fa-calendar-alt"></i>
                        ${new Date(task.bookingDate).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                ` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="btn danger-btn move-to-trash-btn" data-id="${task.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    return li;
}

// Create task element for deleted tasks
function createDeletedTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item deleted';
    
    li.innerHTML = `
        <div class="task-info">
            <div class="task-text-container">
                <span class="task-title">${task.title}</span>
                <span class="task-description">${task.description || ''}</span>
                ${task.bookingDate ? `
                    <span class="task-booking">
                        <i class="far fa-calendar-alt"></i>
                        ${new Date(task.bookingDate).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                ` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="btn secondary-btn restore-btn" data-id="${task.id}">
                <i class="fas fa-undo"></i>
            </button>
            <button class="btn danger-btn delete-permanently-btn" data-id="${task.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    return li;
}

// Add new task
export function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskPrioritySelect = document.getElementById('taskPriority');
    const notificationTimeInput = document.getElementById('notificationTimeInput');
    const taskBookingDate = document.getElementById('taskBookingDate');
    const notificationsToggle = document.getElementById('notificationsToggle');

    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        title: taskText,
        description: taskDescriptionInput.value.trim(),
        priority: taskPrioritySelect.value,
        notificationTime: parseInt(notificationTimeInput.value) || 0,
        bookingDate: taskBookingDate.value,
        completed: false,
        deleted: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateCounts();

    // Schedule notification if enabled
    if ((newTask.notificationTime > 0 || newTask.bookingDate) && notificationsToggle.checked) {
        createNotification(newTask);
    }

    // Clear inputs
    taskInput.value = '';
    taskDescriptionInput.value = '';
    notificationTimeInput.value = '';
    taskBookingDate.value = '';
}

// Handle task list clicks (checkboxes, delete, restore)
export function setupTaskListListeners() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.addEventListener('click', (e) => {
        // Handle checkbox click
        if (e.target.matches('input[type="checkbox"]')) {
            const taskId = parseInt(e.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = e.target.checked;
                saveTasks();
                renderTasks();
                updateCounts();
            }
        }

        // Handle move to trash button
        if (e.target.closest('.move-to-trash-btn')) {
            const button = e.target.closest('.move-to-trash-btn');
            const taskId = parseInt(button.dataset.id);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            if (taskIndex > -1) {
                const taskToMove = tasks.splice(taskIndex, 1)[0];
                deletedTasks.push(taskToMove);
                saveTasks();
                renderTasks();
                updateCounts();
                clearTaskNotification(taskId);
            }
        }

        // Handle permanent delete button
        if (e.target.closest('.delete-permanently-btn')) {
            const button = e.target.closest('.delete-permanently-btn');
            const taskId = parseInt(button.dataset.id);
            const taskIndex = deletedTasks.findIndex(t => t.id === taskId);
            
            if (taskIndex > -1) {
                deletedTasks.splice(taskIndex, 1);
                saveTasks();
                renderTasks();
                updateCounts();
            }
        }

        // Handle restore button
        if (e.target.closest('.restore-btn')) {
            const button = e.target.closest('.restore-btn');
            const taskId = parseInt(button.dataset.id);
            const taskIndex = deletedTasks.findIndex(t => t.id === taskId);
            
            if (taskIndex > -1) {
                const taskToRestore = deletedTasks.splice(taskIndex, 1)[0];
                taskToRestore.completed = false;
                tasks.push(taskToRestore);
                saveTasks();
                renderTasks();
                updateCounts();

                // Re-schedule notification if needed
                const notificationsToggle = document.getElementById('notificationsToggle');
                if ((taskToRestore.notificationTime > 0 || taskToRestore.bookingDate) && notificationsToggle.checked) {
                    createNotification(taskToRestore);
                }
            }
        }
    });
}

// Setup filter buttons
export function setupFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
            updateCounts();
        });
    });
}