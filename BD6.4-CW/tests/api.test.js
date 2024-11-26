const request = require('supertest');
const { app } = require('../index.js');
const {
  getBooks,
  getBookById,
  getReviews,
  getReviewById,
  getUserById,
} = require('../book.js');
const http = require('http');
const {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} = require('@jest/globals');

jest.mock('../book.js', () => ({
  ...jest.requireActual('../book.js'),
  getBooks: jest.fn(),
  getBookById: jest.fn(),
  getReviews: jest.fn(),
  getReviewById: jest.fn(),
  getUserById: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3003, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Error Handling Test', () => {
  it('GET API /api/books should return 404 if no books are found', async () => {
    getBooks.mockReturnValue([]);
    const response = await request(server).get('/api/books');
    expect(response.status).toEqual(404);
    expect(response.body.error).toBe('No books found.');
  });

  it('GET API /api/books/:id should return 404 for non-existing book', async () => {
    getBookById.mockReturnValue(null);
    const response = await request(server).get('/api/books/898');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Book not found');
  });

  it('GET API /api/reviews should return 404 for non-existing reviews', async () => {
    getReviews.mockReturnValue([]);
    const response = await request(server).get('/api/reviews');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No reviews found.');
  });

  it('GET API /api/reviews/:id should return 404 for non exisitng reviews', async () => {
    getReviewById.mockReturnValue(null);
    const response = await request(server).get('/api/reviews/989');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Review not found');
  });

  it('GET API /api/users/:id should return 404 for non-exisitng users', async () => {
    getUserById.mockReturnValue(null);
    const response = await request(server).get('/api/users/989');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
