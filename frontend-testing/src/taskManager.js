/**
 * Task Manager engine that manages state modifications for tasks.
 * Follows modern functional programming practices (immutability).
 */

import { generateUniqueId } from "./utils.js";
import { validateTask } from "./validation.js";

/**
 * Adds a new task to the task list.
 * @param {Array} tasks - Current array of tasks
 * @param {string} title - Title of the new task
 * @param {string} category - Category (e.g., 'Work', 'Personal')
 * @param {string} dueDate - Optional due date string
 * @throws {Error} If validation fails
 * @returns {Array} A new array containing the added task
 */
export function addTask(tasks, title, category = "General", dueDate = "") {
  if (!Array.isArray(tasks)) {
    throw new Error("Tasks must be a valid array.");
  }

  // Use the validator to ensure data integrity
  const validation = validateTask(title, tasks);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const newTask = {
    id: generateUniqueId(),
    title: title.trim(),
    category: category.trim() || "General",
    dueDate: dueDate || "",
    completed: false,
    createdAt: new Date().toISOString()
  };

  // Return a new array with the appended task (immutability)
  return [...tasks, newTask];
}

/**
 * Modifies an existing task by ID with updated data.
 * @param {Array} tasks - Current array of tasks
 * @param {string} id - The ID of the task to update
 * @param {Object} updatedFields - Key-value pairs to merge into the task
 * @throws {Error} If title validation fails
 * @returns {Array} A new array containing the updated task
 */
export function editTask(tasks, id, updatedFields = {}) {
  if (!Array.isArray(tasks)) {
    return [];
  }

  // If we are updating the title, validate it first
  if (updatedFields.title !== undefined) {
    const validation = validateTask(updatedFields.title, tasks, id);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
  }

  return tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        ...updatedFields,
        // Make sure to preserve ID
        id: task.id
      };
    }
    return task;
  });
}

/**
 * Removes a task from the list by ID.
 * @param {Array} tasks - Current array of tasks
 * @param {string} id - ID of the task to delete
 * @returns {Array} A new array with the specified task removed
 */
export function deleteTask(tasks, id) {
  if (!Array.isArray(tasks)) {
    return [];
  }
  return tasks.filter(task => task.id !== id);
}

/**
 * Toggles the completed status of a task by ID.
 * @param {Array} tasks - Current array of tasks
 * @param {string} id - ID of the task to complete
 * @returns {Array} A new array with the completed status toggled
 */
export function completeTask(tasks, id) {
  if (!Array.isArray(tasks)) {
    return [];
  }
  return tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }
    return task;
  });
}

/**
 * Searches and returns tasks whose titles match a search string (case-insensitive).
 * @param {Array} tasks - List of tasks to search
 * @param {string} query - Search term
 * @returns {Array} List of matching tasks
 */
export function searchTask(tasks, query = "") {
  if (!Array.isArray(tasks)) {
    return [];
  }
  
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return tasks;
  }
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(trimmedQuery) ||
    (task.category && task.category.toLowerCase().includes(trimmedQuery))
  );
}

/**
 * Filters the tasks array based on completed status.
 * @param {Array} tasks - Array of tasks
 * @param {string} filterType - 'all' | 'completed' | 'pending'
 * @returns {Array} Filtered list of tasks
 */
export function filterTasks(tasks, filterType = "all") {
  if (!Array.isArray(tasks)) {
    return [];
  }
  
  switch (filterType) {
    case "completed":
      return tasks.filter(task => task.completed === true);
    case "pending":
      return tasks.filter(task => task.completed === false);
    case "all":
    default:
      return tasks;
  }
}
