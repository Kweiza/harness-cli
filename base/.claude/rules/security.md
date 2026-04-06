# Security

- NEVER include secrets in code — use environment variables
- Validate and sanitize all user input at system boundaries
- Follow OWASP Top 10 guidelines
- Audit dependencies for known vulnerabilities regularly
- Use parameterized queries — no string concatenation for SQL
- Set appropriate CORS policies — no wildcard in production
