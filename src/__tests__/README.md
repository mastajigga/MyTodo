# Test Structure

This directory contains all tests for the MyTodo application, organized by type and scope.

## Directory Structure

```
__tests__/
├── unit/               # Unit tests
│   ├── components/     # React component tests
│   ├── hooks/         # Custom hooks tests
│   ├── utils/         # Utility function tests
│   └── services/      # Service layer tests
│
├── integration/        # Integration tests
│   ├── api/           # API endpoint tests
│   ├── database/      # Database operation tests
│   └── auth/          # Authentication flow tests
│
└── e2e/               # End-to-end tests
    ├── flows/         # User flow tests
    ├── navigation/    # Navigation tests
    └── forms/         # Form submission tests
```

## Test Categories

### Unit Tests
- **Components**: Test individual React components in isolation
- **Hooks**: Test custom React hooks
- **Utils**: Test utility functions and helpers
- **Services**: Test service layer functions

### Integration Tests
- **API**: Test API endpoints and their interactions
- **Database**: Test database operations and data persistence
- **Auth**: Test authentication flows and authorization

### E2E Tests
- **Flows**: Test complete user workflows
- **Navigation**: Test application routing and navigation
- **Forms**: Test form submissions and validations

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run e2e tests only
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Best Practices

1. Name test files with `.test.ts` or `.test.tsx` extension
2. Group related tests using `describe` blocks
3. Use meaningful test descriptions with `it` or `test`
4. Follow the AAA pattern (Arrange, Act, Assert)
5. Mock external dependencies appropriately
6. Keep tests focused and isolated
7. Use test data factories for consistent test data
8. Clean up after tests using `afterEach` or `afterAll` 