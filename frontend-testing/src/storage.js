/**
 * Storage Controller module for browser Local Storage integration.
 */

const STORAGE_KEY = "jest_tasks_data";

/**
 * Persists an array of task objects to the browser's localStorage.
 * @param {Array} tasks - List of task objects to serialize and save
 * @returns {boolean} True if saving succeeded, false otherwise
 */
export function saveToLocalStorage(tasks) {
  if (!Array.isArray(tasks)) {
    return false;
  }
  
  if (typeof localStorage === "undefined" || !localStorage) {
    return false;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
    return false;
  }
}

/**
 * Retrieves and deserializes the array of task objects from localStorage.
 * @returns {Array} Array of parsed task objects, or empty array if empty/corrupted
 */
export function loadFromLocalStorage() {
  if (typeof localStorage === "undefined" || !localStorage) {
    return [];
  }
  
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) {
      return [];
    }
    const parsed = JSON.parse(serializedData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse data from localStorage:", error);
    return [];
  }
}
