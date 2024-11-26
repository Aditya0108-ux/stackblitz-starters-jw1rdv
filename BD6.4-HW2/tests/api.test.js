const request = require('supertest');
const { app } = require('../index.js');
const {
  getGames,
  getGameById,
  getGenres,
  getGenreById,
} = require('../game.js');
const http = require('http');
const {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} = require('@jest/globals');

jest.mock('../game.js', () => ({
  ...jest.requireActual('../game.js'),
  getGames: jest.fn(),
  getGameById: jest.fn(),
  getGenres: jest.fn(),
  getGenreById: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3003, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Error Handling Test for Games and Genres', () => {
  it('GET API /api/games should return 404 if no games are found', async () => {
    getGames.mockReturnValue([]);
    const response = await request(server).get('/api/games');
    expect(response.status).toEqual(404);
    expect(response.body.error).toBe('No games found.');
  });

  it('GET API /api/games/:id should return 404 for non-existing game', async () => {
    getGameById.mockReturnValue(null);
    const response = await request(server).get('/api/games/898');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Game not found');
  });

  it('GET API /api/genres should return 404 if no genres are found', async () => {
    getGenres.mockReturnValue([]);
    const response = await request(server).get('/api/genres');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No genres found.');
  });

  it('GET API /api/genres/:id should return 404 for non-existing genre', async () => {
    getGenreById.mockReturnValue(null);
    const response = await request(server).get('/api/genres/989');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Genre not found');
  });
});
