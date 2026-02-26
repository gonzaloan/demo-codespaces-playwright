# Lab 01 - Playwright E2E Testing: User Registration

## Application Under Test

| | |
|---|---|
| **Type** | eCommerce Platform |
| **URL** | https://demo.nopcommerce.com/ |

## Objective

Create an end-to-end automation test for the **User Registration** flow using Playwright with TypeScript.

## Test Scenario: User Registration with Valid Data

### Steps

1. Navigate to the homepage.
2. Click the Register link.
3. Select gender and enter all required fields.
4. Click Register button.

### Expected Results

- Registration is successful.
- Success message appears.
- User is logged in.

## Requirements

### Project Structure
- Page Object classes in `src/pages/`
- Test specs in `src/tests/` (files must end in `.spec.ts`)
- Test data in `src/data/` as JSON files

### Coding Standards
- Use TypeScript as the binding language
- Use Playwright locators (`getByRole`, `getByPlaceholder`, `getByLabel`, `getByText`)
- Load test data (registration details) from JSON files
- Include `expect()` assertions for all expected results
- No unused imports
- Follow single responsibility principle in classes and methods
- Proper exception handling

### Execution
- Tests must pass: `npm test`
- HTML report must be generated automatically

## Grading

Your submission is graded automatically on push. The grader validates:

1. **Structure** - Correct folders and file types
2. **Quality** - Locators, assertions, imports, page classes, JSON data usage
3. **Execution** - Tests run and pass, HTML report is generated

Check the GitHub Actions tab for your results.