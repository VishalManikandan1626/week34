/**
 * Unit tests for storage.js using Jest mocks.
 * Demonstrates how to spy on, mock, and handle exceptions from
 * browser web storage APIs.
 */

import { saveToLocalStorage, loadFromLocalStorage } from "../src/storage.js";

describe("Storage Module Tests", () => {
  const testTasks = [
    { id: "1", title: "Test task 1", completed: false },
    { id: "2", title: "Test task 2", completed: true }
  ];

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore spy/mock implementations back to their original state
    jest.restoreAllMocks();
  });

  // ==========================================
  // 1. saveToLocalStorage() Tests
  // ==========================================
  describe("saveToLocalStorage()", () => {
    test("should serialize and save tasks to localStorage successfully", () => {
      // Create a spy on localStorage.setItem
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

      const success = saveToLocalStorage(testTasks);

      expect(success).toBe(true);
      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(setItemSpy).toHaveBeenCalledWith("jest_tasks_data", JSON.stringify(testTasks));
    });

    test("should return false if input task list is not an array", () => {
      const result = saveToLocalStorage("not-an-array");
      expect(result).toBe(false);
      expect(localStorage.getItem("jest_tasks_data")).toBeNull();
    });

    test("should catch and log errors if localStorage.setItem throws an error (e.g. quota exceeded)", () => {
      // Mock console.error to avoid cluttering test outputs
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      
      // Mock localStorage.setItem to throw an exception
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("Quota exceeded!");
      });

      const success = saveToLocalStorage(testTasks);

      expect(success).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  // ==========================================
  // 2. loadFromLocalStorage() Tests
  // ==========================================
  describe("loadFromLocalStorage()", () => {
    test("should retrieve and deserialize tasks from localStorage successfully", () => {
      // Set test data directly in localStorage
      localStorage.setItem("jest_tasks_data", JSON.stringify(testTasks));
      
      const loadedTasks = loadFromLocalStorage();

      expect(loadedTasks).toEqual(testTasks);
      expect(loadedTasks.length).toBe(2);
    });

    test("should return an empty array if storage is empty", () => {
      const loadedTasks = loadFromLocalStorage();
      expect(loadedTasks).toEqual([]);
      expect(loadedTasks.length).toBe(0);
    });

    test("should return empty array and catch/log errors if stored JSON is corrupted", () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      
      // Save corrupted/malformed JSON string
      localStorage.setItem("jest_tasks_data", "{ invalid json: yes }");

      const loadedTasks = loadFromLocalStorage();

      expect(loadedTasks).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test("should return empty array if retrieved data is not a JSON array", () => {
      // Save a valid JSON object, but not an array
      localStorage.setItem("jest_tasks_data", JSON.stringify({ name: "Not an array" }));

      const loadedTasks = loadFromLocalStorage();

      expect(loadedTasks).toEqual([]);
    });
  });
});
