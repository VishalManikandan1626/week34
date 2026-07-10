/**
 * Unit tests for utils.js helper functions.
 * Demonstrates basic Jest assertions, lifecycle hooks, and mock setups.
 */

import { generateUniqueId, formatDate, sortTasks } from "../src/utils.js";

describe("Utility Module Tests", () => {
  // Lifecycle Hook: Runs once before any tests in this describe block begin
  beforeAll(() => {
    console.log("Starting Utility Module Test Suite...");
  });

  // Lifecycle Hook: Runs once after all tests in this describe block finish
  afterAll(() => {
    console.log("Utility Module Test Suite Complete.");
  });

  // Lifecycle Hook: Runs before each individual test
  beforeEach(() => {
    // Can be used to reset mock configurations or global variables
  });

  // Lifecycle Hook: Runs after each individual test
  afterEach(() => {
    jest.restoreAllMocks(); // Restores any mocked methods back to their original behavior
  });

  // ==========================================
  // 1. generateUniqueId() Tests
  // ==========================================
  describe("generateUniqueId()", () => {
    test("should generate a string ID", () => {
      const id = generateUniqueId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    test("should generate unique IDs on consecutive calls", () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      expect(id1).not.toBe(id2);
    });

    test("should utilize crypto.randomUUID when available in environment", () => {
      // Mock the global crypto object safely using Object.defineProperty
      const originalCrypto = global.crypto;
      const mockRandomUUID = jest.fn().mockReturnValue("1234abcd-1234-abcd-1234-abcd1234abcd");
      
      Object.defineProperty(global, "crypto", {
        value: {
          randomUUID: mockRandomUUID
        },
        configurable: true,
        writable: true
      });

      const id = generateUniqueId();
      
      expect(mockRandomUUID).toHaveBeenCalledTimes(1);
      expect(id).toBe("1234abcd-1234-abcd-1234-abcd1234abcd");

      // Restore original crypto
      if (originalCrypto) {
        Object.defineProperty(global, "crypto", {
          value: originalCrypto,
          configurable: true,
          writable: true
        });
      }
    });
  });

  // ==========================================
  // 2. formatDate() Tests
  // ==========================================
  describe("formatDate()", () => {
    test("should format a valid Date object to YYYY-MM-DD", () => {
      const date = new Date(2026, 6, 10); // July 10, 2026 (Note: month is 0-indexed)
      const formatted = formatDate(date);
      expect(formatted).toBe("2026-07-10");
    });

    test("should format a valid ISO string date to YYYY-MM-DD", () => {
      const formatted = formatDate("2026-07-10T08:00:00Z");
      expect(formatted).toBe("2026-07-10");
    });

    test("should return empty string for null or undefined input", () => {
      expect(formatDate(null)).toBe("");
      expect(formatDate(undefined)).toBe("");
    });

    test("should return empty string for an invalid date string", () => {
      expect(formatDate("not-a-date")).toBe("");
    });
  });

  // ==========================================
  // 3. sortTasks() Tests
  // ==========================================
  describe("sortTasks()", () => {
    const mockTasks = [
      { title: "Review PR", dueDate: "2026-07-15" },
      { title: "Assemble presentation", dueDate: "2026-07-10" },
      { title: "Code refactoring", dueDate: "2026-07-20" }
    ];

    test("should sort tasks by date ascending by default", () => {
      const sorted = sortTasks(mockTasks);
      expect(sorted[0].title).toBe("Assemble presentation"); // 2026-07-10
      expect(sorted[1].title).toBe("Review PR");             // 2026-07-15
      expect(sorted[2].title).toBe("Code refactoring");       // 2026-07-20
    });

    test("should sort tasks by date descending", () => {
      const sorted = sortTasks(mockTasks, "date-desc");
      expect(sorted[0].title).toBe("Code refactoring");       // 2026-07-20
      expect(sorted[1].title).toBe("Review PR");             // 2026-07-15
      expect(sorted[2].title).toBe("Assemble presentation"); // 2026-07-10
    });

    test("should sort tasks alphabetically by title", () => {
      const sorted = sortTasks(mockTasks, "alphabetical");
      expect(sorted[0].title).toBe("Assemble presentation"); // starts with A
      expect(sorted[1].title).toBe("Code refactoring");       // starts with C
      expect(sorted[2].title).toBe("Review PR");             // starts with R
    });

    test("should return empty array when task list is null or invalid", () => {
      expect(sortTasks(null)).toEqual([]);
      expect(sortTasks(undefined)).toEqual([]);
    });

    test("should treat blank/missing dates as epoch (1970) for sorting", () => {
      const tasksWithNoDates = [
        { title: "A", dueDate: "" },
        { title: "B", dueDate: "2026-07-10" }
      ];
      const sorted = sortTasks(tasksWithNoDates, "date-asc");
      expect(sorted[0].title).toBe("A"); // blank date is earlier than 2026
    });
  });
});
