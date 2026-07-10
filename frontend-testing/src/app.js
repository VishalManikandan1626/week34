/**
 * App Controller (app.js)
 * Ties the DOM events to the functional business modules.
 */

import {
  addTask,
  editTask,
  deleteTask,
  completeTask,
  searchTask,
  filterTasks
} from "./taskManager.js";

import {
  saveToLocalStorage,
  loadFromLocalStorage
} from "./storage.js";

import {
  sortTasks,
  formatDate
} from "./utils.js";

// Global state in-memory
let tasksState = [];
let editingTaskId = null; // Keeps track of which task is being edited (null = creation mode)
let currentFilter = "all";

// DOM Elements
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskCategorySelect = document.getElementById("task-category");
const taskDueDateInput = document.getElementById("task-due-date");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const errorBanner = document.getElementById("error-banner");
const charCountSpan = document.getElementById("char-count");

const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const tabButtons = document.querySelectorAll(".tab-btn");
const taskListUl = document.getElementById("task-list");
const emptyStateDiv = document.getElementById("empty-state");

// Counts badge elements
const countAllSpan = document.getElementById("count-all");
const countPendingSpan = document.getElementById("count-pending");
const countCompletedSpan = document.getElementById("count-completed");

/**
 * Initialize Application
 */
function init() {
  // Load initial tasks from local storage
  tasksState = loadFromLocalStorage();
  
  // Set default due date in form (today)
  const today = formatDate(new Date());
  taskDueDateInput.min = today; // Prevent selecting past dates for new tasks

  // Attach event listeners
  setupEventListeners();
  
  // Render initial display
  render();
}

/**
 * Setup Event Listeners for DOM events
 */
function setupEventListeners() {
  // 1. Task Creation / Editing Submission
  taskForm.addEventListener("submit", handleFormSubmit);

  // 2. Character counter on Title input
  taskTitleInput.addEventListener("input", () => {
    const len = taskTitleInput.value.length;
    charCountSpan.textContent = len;
    
    // Style warning if approaching limit (50)
    if (len > 45) {
      charCountSpan.style.color = "var(--danger)";
    } else {
      charCountSpan.style.color = "var(--text-muted)";
    }
  });

  // 3. Cancel Editing Mode
  cancelEditBtn.addEventListener("click", resetFormState);

  // 4. Real-time Search Input
  searchInput.addEventListener("input", render);

  // 5. Sort Dropdown Change
  sortSelect.addEventListener("change", render);

  // 6. Tab Filters (All, Pending, Completed)
  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Deactivate all, activate selected
      tabButtons.forEach(b => b.classList.remove("active"));
      const target = e.currentTarget;
      target.classList.add("active");
      
      currentFilter = target.getAttribute("data-filter");
      render();
    });
  });
}

/**
 * Handle form submissions (Add or Edit task)
 * @param {Event} e 
 */
function handleFormSubmit(e) {
  e.preventDefault();
  hideError();

  const title = taskTitleInput.value;
  const category = taskCategorySelect.value;
  const dueDate = taskDueDateInput.value;

  try {
    if (editingTaskId) {
      // 1. EDIT MODE
      tasksState = editTask(tasksState, editingTaskId, {
        title,
        category,
        dueDate
      });
      resetFormState();
    } else {
      // 2. ADD MODE
      tasksState = addTask(tasksState, title, category, dueDate);
      taskForm.reset();
      charCountSpan.textContent = "0";
    }

    // Save and re-render
    saveToLocalStorage(tasksState);
    render();
  } catch (error) {
    // Catch validation and logic errors thrown by the engines, and display to user
    showError(error.message);
  }
}

/**
 * Puts the form into Edit Mode for a selected task
 * @param {Object} task 
 */
function startEditMode(task) {
  editingTaskId = task.id;
  taskTitleInput.value = task.title;
  taskCategorySelect.value = task.category;
  taskDueDateInput.value = task.dueDate;
  
  charCountSpan.textContent = task.title.length;
  
  // Update Buttons
  submitBtn.textContent = "Update Task";
  cancelEditBtn.classList.remove("hidden");
  
  // Scroll form into view for mobile users
  taskForm.scrollIntoView({ behavior: "smooth" });
  taskTitleInput.focus();
}

/**
 * Exits edit mode and clears form inputs
 */
function resetFormState() {
  editingTaskId = null;
  taskForm.reset();
  charCountSpan.textContent = "0";
  charCountSpan.style.color = "var(--text-muted)";
  
  submitBtn.textContent = "Add Task";
  cancelEditBtn.classList.add("hidden");
  hideError();
}

/**
 * Displays error messages in a warning banner
 * @param {string} msg 
 */
function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove("hidden");
}

/**
 * Hides the error banner
 */
function hideError() {
  errorBanner.textContent = "";
  errorBanner.classList.add("hidden");
}

/**
 * Helper to escape HTML characters (XSS Prevention)
 * @param {string} str 
 * @returns {string} Safe string
 */
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Core rendering pipeline
 * Applies: Search -> Filters -> Sorter -> UI injection
 */
function render() {
  // 1. Update filter counter badges (All, Pending, Completed of the FULL task set)
  countAllSpan.textContent = tasksState.length;
  countPendingSpan.textContent = tasksState.filter(t => !t.completed).length;
  countCompletedSpan.textContent = tasksState.filter(t => t.completed).length;

  // 2. Filter list by completion state
  let processedTasks = filterTasks(tasksState, currentFilter);

  // 3. Search filter
  const searchQuery = searchInput.value;
  processedTasks = searchTask(processedTasks, searchQuery);

  // 4. Sort filter
  const sortCriteria = sortSelect.value;
  processedTasks = sortTasks(processedTasks, sortCriteria);

  // Clear current list
  taskListUl.innerHTML = "";

  if (processedTasks.length === 0) {
    emptyStateDiv.classList.remove("hidden");
    return;
  }
  
  emptyStateDiv.classList.add("hidden");

  // 5. Generate and inject list item elements
  processedTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.setAttribute("data-id", task.id);

    // Format display date
    let dateBadgeHTML = "";
    if (task.dueDate) {
      const todayString = formatDate(new Date());
      const isOverdue = !task.completed && task.dueDate < todayString;
      dateBadgeHTML = `
        <span class="task-due-tag ${isOverdue ? "overdue" : ""}">
          📅 ${isOverdue ? "Overdue: " : "Due: "}${escapeHTML(task.dueDate)}
        </span>
      `;
    }

    li.innerHTML = `
      <div class="task-left">
        <label class="checkbox-container">
          <input type="checkbox" class="task-toggle" ${task.completed ? "checked" : ""}>
          <span class="checkmark"></span>
        </label>
        <div class="task-details">
          <span class="task-title">${escapeHTML(task.title)}</span>
          <div class="task-meta">
            <span class="task-category-tag">${escapeHTML(task.category)}</span>
            ${dateBadgeHTML}
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit-btn" title="Edit Task">✏️</button>
        <button class="icon-btn delete-btn" title="Delete Task">🗑️</button>
      </div>
    `;

    // Bind item event handlers directly
    
    // A. Toggle complete status
    const toggleInput = li.querySelector(".task-toggle");
    toggleInput.addEventListener("change", () => {
      tasksState = completeTask(tasksState, task.id);
      saveToLocalStorage(tasksState);
      render();
    });

    // B. Trigger Edit task
    const editBtn = li.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      startEditMode(task);
    });

    // C. Trigger Delete task
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      // If we delete the task currently being edited, cancel edit mode
      if (editingTaskId === task.id) {
        resetFormState();
      }
      tasksState = deleteTask(tasksState, task.id);
      saveToLocalStorage(tasksState);
      render();
    });

    taskListUl.appendChild(li);
  });
}

// Start the app!
document.addEventListener("DOMContentLoaded", init);
