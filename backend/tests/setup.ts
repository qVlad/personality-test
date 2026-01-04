// Jest setup file for backend tests
// Add any global test setup here

// Increase timeout for integration tests
jest.setTimeout(10000);

// Suppress console.error in tests (expected errors from error handler)
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});
