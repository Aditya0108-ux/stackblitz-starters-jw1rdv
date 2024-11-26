const request = require('supertest');
const { app, getAllRecipes, getRecipeById, addRecipe } = require('../index.js');
const http = require('http');
const {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} = require('@jest/globals');

jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  getAllRecipes: jest.fn(),
  getRecipeById: jest.fn(),
  addRecipe: jest.fn(),
}));

let server;

beforeAll((done) => {
  jest.setTimeout(10000);
  server = http.createServer(app);
  server.listen(3003, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints for Recipes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for getting all recipes
  it('should retrieve all recipes', async () => {
    const mockRecipes = [
      {
        id: 1,
        name: 'Spaghetti Bolognese',
        cuisine: 'Italian',
        difficulty: 'Medium',
      },
      {
        id: 2,
        name: 'Chicken Tikka Masala',
        cuisine: 'Indian',
        difficulty: 'Hard',
      },
    ];

    getAllRecipes.mockResolvedValue(mockRecipes);

    const result = await request(server).get('/recipes');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockRecipes);
  });

  // Test for getting a specific recipe by ID
  it('should retrieve a specific recipe by id', async () => {
    const mockRecipe = {
      id: 1,
      name: 'Spaghetti Bolognese',
      cuisine: 'Italian',
      difficulty: 'Medium',
    };

    getRecipeById.mockResolvedValue(mockRecipe);

    const result = await request(server).get('/recipes/details/1');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockRecipe);
  });

  // Test for adding a new recipe
  it('should add a new recipe', async () => {
    const mockRecipe = {
      id: 3,
      name: 'Sushi',
      cuisine: 'Japanese',
      difficulty: 'Hard',
    };

    addRecipe.mockResolvedValue(mockRecipe);

    const result = await request(server)
      .post('/recipes/new')
      .send({ name: 'Sushi', cuisine: 'Japanese', difficulty: 'Hard' });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockRecipe);
  });

  it('should return 404 for non-existing recipe', async () => {
    getRecipeById.mockResolvedValue(null);

    const res = await request(server).get('/recipes/details/999');
    expect(res.statusCode).toEqual(404);
  });
});
