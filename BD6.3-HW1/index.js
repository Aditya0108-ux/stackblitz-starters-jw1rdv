let express = require('express');
let app = express();
app.use(express.json());

let games = [
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

let developers = [{ id: 1, name: 'Nintendo', country: 'Japan' }];

// Helper functions for games and developers
async function getAllGames() {
  return games;
}

async function getGameById(id) {
  return games.find((game) => game.id === id);
}

async function addGame(data) {
  data.id = games.length + 1;
  games.push(data);
  return data;
}

async function getDeveloperById(id) {
  return developers.find((developer) => developer.id === id);
}

async function addDeveloper(data) {
  data.id = developers.length + 1;
  developers.push(data);
  return data;
}

// Exercise 1: Get All Games
// http://localhost:3000/games
app.get('/games', async (req, res) => {
  const allGames = await getAllGames();
  res.json(allGames);
});

// Exercise 2: Get Game by ID
// http://localhost:3000/games/details/1
app.get('/games/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let game = await getGameById(id);
  if (!game) {
    return res.status(404).send('Game not found');
  }
  res.json(game);
});

// Exercise 3: Add a New Game
// http://localhost:3000/games/new
app.post('/games/new', async (req, res) => {
  const newGame = await addGame(req.body);
  res.status(201).json(newGame);
});

// Exercise 4: Get Developer by ID
// http://localhost:3000/developers/details/1
app.get('/developers/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let developer = await getDeveloperById(id);
  if (!developer) {
    return res.status(404).send('Developer not found');
  }
  res.json(developer);
});

// Exercise 5: Add a New Developer
// http://localhost:3000/developers/new
app.post('/developers/new', async (req, res) => {
  const newDeveloper = await addDeveloper(req.body);
  res.status(201).json(newDeveloper);
});

module.exports = {
  app,
  getAllGames,
  getGameById,
  addGame,
  getDeveloperById,
  addDeveloper,
};
