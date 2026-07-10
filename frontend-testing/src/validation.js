/**
 * Validation rules for Task Management objects.
 */

/**
 * Validates a task title based on business constraints:
 * 1. Must be a non-empty string.
 * 2. Must not be empty or contain only whitespaces.
 * 3. Must not exceed 50 characters.
 * 4. Must not be a duplicate of an existing active task title (case-insensitive).
 * 
 * @param {string} title - The task title to validate
 * @param {Array} existingTasks - List of existing tasks to check for duplicates
 * @param {string} [currentTaskId] - Optional ID of the task being edited (to ignore self-duplicates)
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateTask(title, existingTasks = [], currentTaskId = null) {
  // 1. Invalid Data Type Check
  if (typeof title !== "string") {
    return {
      isValid: false,
      error: "Task title must be a valid string."
    };
  }

  const trimmedTitle = title.trim();

  // 2. Empty Input Check
  if (!trimmedTitle) {
    return {
      isValid: false,
      error: "Task title cannot be empty."
    };
  }

  // 3. Long Input Check (Max 50 Characters)
  if (trimmedTitle.length > 50) {
    return {
      isValid: false,
      error: "Task title cannot exceed 50 characters."
    };
  }

  // 4. Duplicate Task Check (Case-insensitive)
  const isDuplicate = existingTasks.some(task => {
    // If we are editing, ignore the task itself
    if (currentTaskId && task.id === currentTaskId) {
      return false;
    }
    return task.title.trim().toLowerCase() === trimmedTitle.toLowerCase();
  });

  if (isDuplicate) {
    return {
      isValid: false,
      error: "A task with this title already exists."
    };
  }

  // If all validation rules pass
  return {
    isValid: true,
    error: null
  };
}
