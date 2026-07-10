/**
 * Unit tests for the Task Manager engine (taskManager.js).
 * Validates immutable additions, modifications, deletions, searches, and filters.
 */

import {
  addTask,
  editTask,
  deleteTask,
  completeTask,
  searchTask,
  filterTasks
} from "../src/taskManager.js";

describe("Task Manager Module Tests", () => {
  let initialTasks;

  beforeEach(() => {
    // Standard set of starting tasks before each test to guarantee isolated states
    initialTasks = [
      {
        id: "task-1",
        title: "Submit internship report",
        category: "University",
        dueDate: "2026-07-12",
        completed: false,
        createdAt: "2026-07-09T10:00:00.000Z"
      },
      {
        id: "task-2",
        title: "Code review with lead engineer",
        category: "Work",
        dueDate: "2026-07-10",
        completed: true,
        createdAt: "2026-07-08T09:00:00.000Z"
      }
    ];
  });

  // ==========================================
  // 1. Add Task Tests
  // ==========================================
  describe("addTask()", () => {
    test("should add a task successfully with valid parameters", () => {
      const title = "Write unit tests in Jest";
      const category = "Work";
      const dueDate = "2026-07-11";

      const updatedTasks = addTask(initialTasks, title, category, dueDate);

      expect(updatedTasks.length).toBe(3);
      
      // The last element in the array is our newly added task
      const newTask = updatedTasks[2];
      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe("Write unit tests in Jest");
      expect(newTask.category).toBe("Work");
      expect(newTask.dueDate).toBe("2026-07-11");
      expect(newTask.completed).toBe(false); // New tasks must start as pending
    });

    test("should use 'General' as the default category if none is specified", () => {
      const updatedTasks = addTask(initialTasks, "Clean code guidelines");
      const newTask = updatedTasks[2];
      expect(newTask.category).toBe("General");
    });

    test("should prevent adding a task with an empty title by throwing an error", () => {
      // Asserting that a function call throws an error in Jest requires passing
      // a wrapper function to expect()
      expect(() => {
        addTask(initialTasks, "");
      }).toThrow("Task title cannot be empty.");

      // Check that the original task array was not affected
      expect(initialTasks.length).toBe(2);
    });

    test("should prevent adding a task with a duplicate title by throwing an error", () => {
      expect(() => {
        addTask(initialTasks, "Submit internship report");
      }).toThrow("A task with this title already exists.");
    });
  });

  // ==========================================
  // 2. Edit Task Tests
  // ==========================================
  describe("editTask()", () => {
    test("should edit an existing task's details successfully", () => {
      const updatedTasks = editTask(initialTasks, "task-1", {
        title: "Submit completed internship report",
        category: "Education"
      });

      const updatedTask = updatedTasks.find(t => t.id === "task-1");
      expect(updatedTask.title).toBe("Submit completed internship report");
      expect(updatedTask.category).toBe("Education");
      expect(updatedTask.completed).toBe(false); // Preserved original status
    });

    test("should throw an error if editing a task name to a duplicate title", () => {
      expect(() => {
        editTask(initialTasks, "task-1", {
          title: "Code review with lead engineer" // Matches task-2 title
        });
      }).toThrow("A task with this title already exists.");
    });

    test("should not modify anything if the task ID does not exist", () => {
      const updatedTasks = editTask(initialTasks, "non-existent-id", {
        title: "New Title"
      });
      expect(updatedTasks).toEqual(initialTasks);
    });
  });

  // ==========================================
  // 3. Delete Task Tests
  // ==========================================
  describe("deleteTask()", () => {
    test("should remove a task from the list by ID successfully", () => {
      const updatedTasks = deleteTask(initialTasks, "task-1");
      
      expect(updatedTasks.length).toBe(1);
      expect(updatedTasks.find(t => t.id === "task-1")).toBeUndefined();
      expect(updatedTasks[0].id).toBe("task-2"); // Still remains
    });

    test("should not remove any tasks if ID does not exist", () => {
      const updatedTasks = deleteTask(initialTasks, "non-existent-id");
      expect(updatedTasks.length).toBe(2);
      expect(updatedTasks).toEqual(initialTasks);
    });
  });

  // ==========================================
  // 4. Complete Task Tests
  // ==========================================
  describe("completeTask()", () => {
    test("should toggle the completion status of a task from false to true", () => {
      const updatedTasks = completeTask(initialTasks, "task-1"); // original was false
      const task = updatedTasks.find(t => t.id === "task-1");
      expect(task.completed).toBe(true);
    });

    test("should toggle the completion status of a task from true to false", () => {
      const updatedTasks = completeTask(initialTasks, "task-2"); // original was true
      const task = updatedTasks.find(t => t.id === "task-2");
      expect(task.completed).toBe(false);
    });
  });

  // ==========================================
  // 5. Search Task Tests
  // ==========================================
  describe("searchTask()", () => {
    test("should return tasks matching search query in titles (case-insensitive)", () => {
      const results = searchTask(initialTasks, "REPORT");
      expect(results.length).toBe(1);
      expect(results[0].id).toBe("task-1");
    });

    test("should return tasks matching search query in categories", () => {
      const results = searchTask(initialTasks, "work");
      expect(results.length).toBe(1);
      expect(results[0].id).toBe("task-2");
    });

    test("should return all tasks if search query is empty or whitespace", () => {
      const results = searchTask(initialTasks, "   ");
      expect(results.length).toBe(2);
      expect(results).toEqual(initialTasks);
    });

    test("should return an empty array if no tasks match", () => {
      const results = searchTask(initialTasks, "Unicorn");
      expect(results.length).toBe(0);
    });
  });

  // ==========================================
  // 6. Filter Tasks Tests
  // ==========================================
  describe("filterTasks()", () => {
    test("should return all tasks when filtering by 'all'", () => {
      const results = filterTasks(initialTasks, "all");
      expect(results.length).toBe(2);
    });

    test("should filter and return only completed tasks", () => {
      const results = filterTasks(initialTasks, "completed");
      expect(results.length).toBe(1);
      expect(results[0].id).toBe("task-2"); // task-2 is completed
    });

    test("should filter and return only pending tasks", () => {
      const results = filterTasks(initialTasks, "pending");
      expect(results.length).toBe(1);
      expect(results[0].id).toBe("task-1"); // task-1 is pending
    });
  });
});
