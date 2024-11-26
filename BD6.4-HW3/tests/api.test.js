const request = require('supertest');
const { app } = require('../index.js');
const {
  getArticles,
  getArticleById,
  getComments,
  getCommentById,
  getUserById,
} = require('../article.js');
const http = require('http');
const {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} = require('@jest/globals');

jest.mock('../article.js', () => ({
  ...jest.requireActual('../article.js'),
  getArticles: jest.fn(),
  getArticleById: jest.fn(),
  getComments: jest.fn(),
  getCommentById: jest.fn(),
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

describe('API Error Handling Test for Articles, Comments, and Users', () => {
  it('GET API /api/articles should return 404 if no articles are found', async () => {
    getArticles.mockReturnValue([]);
    const response = await request(server).get('/api/articles');
    expect(response.status).toEqual(404);
    expect(response.body.error).toBe('No articles found.');
  });

  it('GET API /api/articles/:id should return 404 for non-existing article', async () => {
    getArticleById.mockReturnValue(null);
    const response = await request(server).get('/api/articles/123');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Article not found');
  });

  it('GET API /api/comments should return 404 if no comments are found', async () => {
    getComments.mockReturnValue([]);
    const response = await request(server).get('/api/comments');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No comments found.');
  });

  it('GET API /api/comments/:id should return 404 for non-existing comment', async () => {
    getCommentById.mockReturnValue(null);
    const response = await request(server).get('/api/comments/456');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Comment not found');
  });

  it('GET API /api/users/:id should return 404 for non-existing user', async () => {
    getUserById.mockReturnValue(null);
    const response = await request(server).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
