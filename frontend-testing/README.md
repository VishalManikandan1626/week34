# Frontend Unit Testing with Jest 🧪
### Task Management Application (Testing Edition)

A comprehensive, production-grade learning repository demonstrating frontend unit testing of a modular **Task Management Application** using **Jest**, **Babel**, and **Local Storage** under simulated browser environments (`jsdom`).

This repository is structured for portfolio display and serves as a complete reference for academic or internship submissions.

---

## 📖 Table of Contents
1. [What is Unit Testing?](#1-what-is-unit-testing)
2. [Why Jest?](#2-why-jest)
3. [Testing Concepts Explained](#3-testing-concepts-explained)
   - [Test Lifecycle Hooks](#test-lifecycle-hooks)
   - [Assertions](#assertions)
   - [Mocking & Spying](#mocking--spying)
   - [Code Coverage](#code-coverage)
4. [Project Architecture & Features](#4-project-architecture--features)
5. [Folder Structure](#5-folder-structure)
6. [Installation & Setup](#6-installation--setup)
7. [Running Tests & Reports](#7-running-tests--reports)
8. [Learning Outcomes](#8-learning-outcomes)
9. [Best Practices for Frontend Testing](#9-best-practices-for-frontend-testing)
10. [Future Improvements](#10-future-improvements)

---

## 1. What is Unit Testing?
**Unit testing** is a software development process in which the smallest testable parts of an application, called *units* (typically individual functions, methods, or modules), are individually and independently scrutinized for proper operation.

In frontend engineering:
* **What is a "Unit"?:** A pure helper function (e.g., date formatter, sorting function) or a business-logic module (e.g., validator, task state modifier).
* **Isolation is Key:** Unit tests isolate code from external influences. For example, testing a validator does not require loading a live database or clicking real DOM nodes; we supply input values directly to the function and assert the return values.

---

## 2. Why Jest?
[Jest](https://jestjs.io/) is a delightful, zero-configuration JavaScript testing framework maintained by Meta. It is the industry standard for testing frontend code because:
1. **Zero Configuration:** Works out of the box for most JavaScript projects.
2. **Speed & Parallelization:** Runs tests in parallel, optimizing execution speed.
3. **Built-in Mocking & Spies:** No need for secondary libraries (like Sinon or Chai) to handle mocking or assertions.
4. **JSDOM Integration:** Comes integrated with `jsdom`, a full client-side JavaScript implementation of the WHATWG DOM and HTML standards, simulating a browser environment inside Node.js.
5. **Excellent Code Coverage:** Includes a built-in coverage runner backed by Istanbul.

---

## 3. Testing Concepts Explained

### Test Lifecycle Hooks
Jest provides hooks to set up environments before tests run and clean up after they complete:
* `beforeAll(fn)`: Runs a callback once *before* any of the tests in a file or describe block start. Great for setting up database connections or initializing heavy mock engines.
* `beforeEach(fn)`: Runs a callback *before* each individual test. Perfect for resetting state, clearing local storage, or reinstantiating helper objects to ensure test isolation.
* `afterEach(fn)`: Runs *after* each individual test finishes. Usually used to restore original implementations of mocked functions (`jest.restoreAllMocks()`).
* `afterAll(fn)`: Runs once *after* all tests have finished executing. Ideal for closing file handles, stopping servers, or printing summary diagnostics.

### Assertions
Assertions are statements that verify if a given value matches our expectations. In Jest, they start with `expect()` and chain into a matcher function:
* `toBe(value)`: Compares primitives using `Object.is` (strict equality).
* `toEqual(value)`: Recursively compares the properties of arrays or objects (deep structural equality).
* `toThrow(error)`: Verifies that a function throws an exception when invoked.
* `toContain(item)`: Checks if an array contains a specific value.

### Mocking & Spying
* **Mocking:** Replacing a real dependency (e.g., an API module, or `window.localStorage`) with a fake implementation to isolate the unit under test.
* **Spying:** Observing calls to a real function without necessarily changing its behavior. We can spy on a method using `jest.spyOn()` to verify how many times it was called, with what arguments, and what it returned.

### Code Coverage
Code coverage measures how much of your production code is actually exercised by your test suite:
1. **Statement Coverage:** Percentage of executable statements executed.
2. **Branch Coverage:** Percentage of decision paths (e.g., `if/else` conditions) executed.
3. **Function Coverage:** Percentage of defined functions called.
4. **Line Coverage:** Percentage of lines of code run.

---

## 4. Project Architecture & Features

This application implements a complete **Task Management Dashboard** with the following capabilities:
* **Add Task:** Immutable state modification, appending a task with a uniquely generated ID, category, title, and due date.
* **Edit Task:** Editing existing titles, categories, and due dates dynamically.
* **Delete Task:** Removing items from the active board.
* **Complete Task:** Interactive checkboxes to toggle completion.
* **Search Task:** Instant keypress queries filtering matching titles and categories.
* **Filter Tasks:** Filter views by All, Completed, or Pending states.
* **Task Validation:** Restricts duplicate task names, empty inputs, non-string types, and limits characters to 50.
* **Local Storage Integration:** Serializes, saves, and retrieves state so tasks persist across tab reloads.

The architecture strictly decouples the **Business Logic (Functional Engines)** from the **User Interface (DOM Controller)**:
* `taskManager.js`, `storage.js`, `validation.js`, `utils.js` are written as **pure modules** that do not depend on the browser DOM. This makes them 100% testable.
* `app.js` handles event listening and rendering, importing the tested modules.

---

## 5. Folder Structure

```
frontend-testing/
│
├── src/                      # Production source code
│   ├── index.html            # Main markup & dashboard layout
│   ├── style.css             # Fluid, responsive user interface styling
│   ├── app.js                # DOM controller & event handler wireframe
│   ├── taskManager.js        # Pure functions for adding, editing, and deleting tasks
│   ├── storage.js            # Safe wrappers around browser localStorage
│   ├── validation.js         # Text validator for character caps & duplicate prevention
│   └── utils.js              # Unique ID generator, date formatting, and sorting
│
├── tests/                    # Jest Unit Test Suite
│   ├── taskManager.test.js   # Verifies task state engines, additions, and filters
│   ├── validation.test.js    # Tests boundary caps, types, and duplicate checks
│   ├── storage.test.js       # Spies on localStorage, tests write loops & parse errors
│   └── utils.test.js         # Tests crypto fallback ID generation, dates, and sorting
│
├── package.json              # Subproject dependency tree and script commands
├── jest.config.js            # Jest testing configuration (targets jsdom env)
├── babel.config.js           # Babel preset compiler (enables modern ES6 imports)
├── .gitignore                # Tells Git to skip node_modules and coverage reports
└── README.md                 # This documentation file
```

---

## 6. Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and `npm` installed.

### Steps
1. Navigate to the project root directory:
   ```bash
   cd frontend-testing
   ```
2. Install dependencies (this fetches Jest, Babel, JSDOM, and presets):
   ```bash
   npm install
   ```

---

## 7. Running Tests & Reports

Run the following scripts inside the `frontend-testing` directory:

### Run Tests Once
Runs all test suites sequentially and prints individual test durations and statuses.
```bash
npm test
```

### Run Tests in Watch Mode
Launches Jest in watch mode. It monitors files and automatically re-runs tests whenever you edit and save changes.
```bash
npm run test:watch
```

### Generate Code Coverage Report
Executes Jest, calculates exact code coverage percentages, and outputs a visual HTML coverage dashboard.
```bash
npm run coverage
```
After executing this command, a new folder named `/coverage/` will appear. Open `/coverage/lcov-report/index.html` in any browser to inspect line-by-line coverage analysis!

---

## 8. Learning Outcomes
By exploring and studying this repository, you will learn to:
* **Adopt Test-Driven Development (TDD) Mindsets:** Write deterministic business logic before attaching DOM event handlers.
* **Configure Test Runners:** Set up Babel transpilation and `jsdom` environments.
* **Control Web Storage APIs:** Mock web APIs like `localStorage` and intercept exceptions using Jest Spies.
* **Safeguard Data Integrity:** Write unit tests to check character overflows, duplicates, and type mismatches.
* **Leverage Lifecycle Hooks:** Isolate test runs perfectly using setups (`beforeEach`) and teardowns (`afterEach`).
* **Inspect Code Quality:** Read, interpret, and improve Istanbul coverage reports.

---

## 9. Best Practices for Frontend Testing
1. **Decouple DOM from Logic:** Never embed business rules directly inside UI events. Extract them into clean, pure functions.
2. **One Assertion Theme per Test:** Keep tests focused on a single assertion or logical progression. This makes failing tests much easier to debug.
3. **Keep Tests Independent:** A test should never rely on the side effects or state modifications of a previous test. Reset states in `beforeEach`.
4. **Mock External Networks & APIs:** Never make actual HTTP fetches in unit tests. Mock fetch endpoints using Jest to ensure consistent, offline test results.
5. **Achieve High Branch Coverage:** Don't just test the "happy path." Write tests for every `if/else`, error boundaries, and empty states.

---

## 10. Future Improvements
* **Integration Testing:** Write tests simulating multi-step user behaviors (e.g., typing a task, clicking add, and verifying the task physically appears in the DOM list).
* **End-to-End (E2E) Testing:** Incorporate headless automation tools like Playwright or Cypress to test complete workflows in real browsers.
* **CI/CD Integration:** Set up GitHub Actions to trigger `npm test` automatically whenever a pull request is submitted, blocking merges on test failures.

---
*Created for portfolio submission and software engineering internship showcase.*
