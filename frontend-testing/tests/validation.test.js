/**
 * Unit tests for validation.js logic.
 * Demonstrates how to test edge cases, custom business rules,
 * and parameterized inputs.
 */

import { validateTask } from "../src/validation.js";

describe("Validation Module Tests", () => {
  const existingTasks = [
    { id: "1", title: "Buy groceries" },
    { id: "2", title: "Complete coding challenge" }
  ];

  test("should pass validation for a valid unique task title", () => {
    const result = validateTask("Plan vacation", existingTasks);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  test("should fail validation when task title is empty", () => {
    const result = validateTask("", existingTasks);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Task title cannot be empty.");
  });

  test("should fail validation when task title contains only whitespace", () => {
    const result = validateTask("    ", existingTasks);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Task title cannot be empty.");
  });

  test("should fail validation when task title exceeds 50 characters", () => {
    const extraLongTitle = "A".repeat(51);
    const result = validateTask(extraLongTitle, existingTasks);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Task title cannot exceed 50 characters.");
  });

  test("should fail validation when task title is a duplicate (case-insensitive)", () => {
    const result = validateTask("BUY GROCERIES", existingTasks);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("A task with this title already exists.");
  });

  test("should pass validation when duplicate title matches task being edited", () => {
    // When editing task ID "1", its own title "Buy groceries" is allowed
    const result = validateTask("Buy groceries", existingTasks, "1");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  test("should fail validation when title is a duplicate of ANOTHER task during edit", () => {
    // When editing task ID "1", setting its title to "Complete coding challenge" (ID "2") should block
    const result = validateTask("Complete coding challenge", existingTasks, "1");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("A task with this title already exists.");
  });

  test("should fail validation when task title is not a string", () => {
    const resultNull = validateTask(null, existingTasks);
    const resultNumber = validateTask(12345, existingTasks);
    const resultObject = validateTask({ title: "Object Title" }, existingTasks);

    expect(resultNull.isValid).toBe(false);
    expect(resultNull.error).toBe("Task title must be a valid string.");

    expect(resultNumber.isValid).toBe(false);
    expect(resultNumber.error).toBe("Task title must be a valid string.");

    expect(resultObject.isValid).toBe(false);
    expect(resultObject.error).toBe("Task title must be a valid string.");
  });
});
