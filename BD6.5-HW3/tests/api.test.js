const request = require('supertest');
const { app, validateArticle, validateAuthor } = require('../index.js');
const http = require('http');
let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints to add Data', () => {
  it('should add a new article with valid input', async () => {
    const res = await request(server).post('/api/articles').send({
      title: 'Understanding JavaScript',
      content:
        'JavaScript is a versatile language used for both frontend and backend development.',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 3,
      title: 'Understanding JavaScript',
      content:
        'JavaScript is a versatile language used for both frontend and backend development.',
    });
  });

  it('should return 400 for invalid article input', async () => {
    const res = await request(server).post('/api/articles').send({
      title: 'Understanding JavaScript',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Content is required and it should be a string.');
  });

  it('should add a new author with valid input', async () => {
    const res = await request(server).post('/api/authors').send({
      name: 'John Doe',
      articleId: 1,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 3,
      name: 'John Doe',
      articleId: 1,
    });
  });

  it('should return 400 for invalid author input', async () => {
    const res = await request(server).post('/api/authors').send({
      name: 'John Doe',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(
      'Article ID is required and it should be a number.'
    );
  });

  it('should return 400 if article ID does not exist', async () => {
    const res = await request(server).post('/api/authors').send({
      name: 'Jane Doe',
      articleId: 99,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Article ID does not exist.');
  });
});

describe('Validation Functions', () => {
  it('should validate article input correctly', () => {
    expect(
      validateArticle({
        title: 'Understanding JavaScript',
        content:
          'JavaScript is a versatile language used for both frontend and backend development.',
      })
    ).toBeNull();
    expect(validateArticle({ title: 'Understanding JavaScript' })).toEqual(
      'Content is required and it should be a string.'
    );
    expect(validateArticle({ content: 'Some content' })).toEqual(
      'Title is required and it should be a string.'
    );
  });

  it('should validate author input correctly', () => {
    expect(
      validateAuthor({
        name: 'John Doe',
        articleId: 1,
      })
    ).toBeNull();
    expect(validateAuthor({ name: 'John Doe' })).toEqual(
      'Article ID is required and it should be a number.'
    );
    expect(validateAuthor({ articleId: 1 })).toEqual(
      'Name is required and it should be a string.'
    );
  });
});
