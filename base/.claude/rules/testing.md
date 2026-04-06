# Testing

- New features must include tests
- Bug fixes must include a regression test that reproduces the bug first
- Tests must pass in CI before merge
- External dependencies may be mocked; prefer integration tests for DB
- Test names should describe the behavior: `test_returns_404_when_user_not_found`
- Arrange-Act-Assert pattern for test structure
