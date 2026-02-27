# Lab 01 - Playwright E2E Testing: User Registration

## Application Under Test

| | |
|---|---|
| **Type** | eCommerce Platform |
| **URL** | https://demo.nopcommerce.com/ |
n
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
- Static config in `src/data/` as JSON files (expected messages, page titles, etc.)

### Coding Standards
- Use TypeScript as the binding language
- Use Playwright locators (`getByRole`, `getByPlaceholder`, `getByLabel`, `getByText`)
- Use `@faker-js/faker` to generate dynamic user data (name, email, password) — avoids duplicate registration errors
- Keep static config values (success messages, titles) in a JSON file under `src/data/`
- Include `expect()` assertions for all expected results
- No unused imports
- Follow single responsibility principle in classes and methods
- Proper exception handling

### Example: dynamic data with faker

```typescript
import { faker } from '@faker-js/faker';
import config from '../data/config.json';

const user = {
    firstName: faker.person.firstName(),
    lastName:  faker.person.lastName(),
    email:     faker.internet.email(),
    password:  faker.internet.password({ length: 10 }),
};
```

### Execution
- Tests must pass: `npm test`
- HTML report must be generated automatically

## Grading

Your submission is graded automatically on push. The grader validates:

1. **Structure** - Correct folders and file types
2. **Quality** - Locators, assertions, imports, page classes, JSON data usage
3. **Execution** - Tests run and pass, HTML report is generated

Check the GitHub Actions tab for your results.