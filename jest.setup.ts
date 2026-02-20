import '@testing-library/jest-dom';

// mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.OPENAI_API_KEY = 'sk-test-key';
process.env.AUTH_SECRET = 'test-auth-secret';
