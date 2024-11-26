const request = require('supertest');
const {
  app,
  getAllGames,
  getGameById,
  addGame,
  getDeveloperById,
  addDeveloper,
} = require('../index.js');
const http = require('http');
const { describe } = require('node:test');

// Mocking the functions for games and developers
jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  getAllGames: jest.fn(),
  getGameById: jest.fn(),
  addGame: jest.fn(),
  getDeveloperById: jest.fn(),
  addDeveloper: jest.fn(),
}));

let server;

beforeAll((done) => {
  jest.setTimeout(10000); // Increase timeout to 10 seconds for slow server startup
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all games', async () => {
    const mockGames = [
      {
        id: 1,
        title: 'The Legend of Zelda',
        genre: 'Adventure',
        developer: 'Nintendo',
      },
      {
        id: 2,
        title: 'Super Mario Bros',
        genre: 'Platformer',
        developer: 'Nintendo',
      },
    ];

    getAllGames.mockResolvedValue(mockGames);

    const result = await request(server).get('/games');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockGames);
  });

  it('should retrieve a specific game by id', async () => {
    const mockGame = {
      id: 1,
      title: 'The Legend of Zelda',
      genre: 'Adventure',
      developer: 'Nintendo',
    };

    getGameById.mockResolvedValue(mockGame);

    const result = await request(server).get('/games/details/1');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockGame);
  });

  it('should add a new game', async () => {
    const mockGame = {
      id: 3,
      title: 'Half-Life',
      genre: 'FPS',
      developer: 'Valve',
    };

    addGame.mockResolvedValue(mockGame);

    const result = await request(server).post('/games/new').send({
      title: 'Half-Life',
      genre: 'FPS',
      developer: 'Valve',
    });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockGame);
  });

  it('should retrieve a specific developer by id', async () => {
    const mockDeveloper = { id: 1, name: 'Nintendo', country: 'Japan' };

    getDeveloperById.mockResolvedValue(mockDeveloper);

    const res = await request(server).get('/developers/details/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockDeveloper);
  });

  it('should add a new developer', async () => {
    const mockDeveloper = { id: 2, name: 'Epic Games', country: 'USA' };

    addDeveloper.mockResolvedValue(mockDeveloper);

    const res = await request(server)
      .post('/developers/new')
      .send({ name: 'Epic Games', country: 'USA' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockDeveloper);
  });

  it('should return 404 for non-existing game', async () => {
    getGameById.mockResolvedValue(null);

    const res = await request(server).get('/games/details/999');
    expect(res.statusCode).toEqual(404);
  });

  it('should return 404 for non-existing developer', async () => {
    getDeveloperById.mockResolvedValue(null);

    const res = await request(server).get('/developers/details/999');
    expect(res.statusCode).toEqual(404);
  });
});
