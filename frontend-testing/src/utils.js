/**
 * Utility helper functions for the Task Management Application.
 */

/**
 * Generates a standard unique ID using a cryptographically random string or a fallback timestamp.
 * Used for tagging each task with a unique identifier.
 * @returns {string} Unique ID
 */
export function generateUniqueId() {
  // Try to use modern crypto API if available, fallback to random string
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 9);
}

/**
 * Formats a raw Date object or ISO string into a friendly "YYYY-MM-DD" format.
 * @param {Date|string|number} dateInput 
 * @returns {string} Formatted date string or empty string if invalid
 */
export function formatDate(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  
  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return "";
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

/**
 * Sorts an array of tasks based on a sorting criteria.
 * @param {Array} tasks - Array of task objects
 * @param {string} criteria - 'date-asc', 'date-desc', 'alphabetical'
 * @returns {Array} New sorted array
 */
export function sortTasks(tasks, criteria = "date-asc") {
  if (!Array.isArray(tasks)) {
    return [];
  }
  
  // Create a shallow copy to avoid mutating original array
  const sorted = [...tasks];
  
  return sorted.sort((a, b) => {
    if (criteria === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    
    // Sort by Date
    const dateA = new Date(a.dueDate || "1970-01-01").getTime();
    const dateB = new Date(b.dueDate || "1970-01-01").getTime();
    
    if (criteria === "date-asc") {
      return dateA - dateB;
    } else if (criteria === "date-desc") {
      return dateB - dateA;
    }
    
    return 0;
  });
}
