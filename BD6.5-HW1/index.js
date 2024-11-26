const express = require('express');
const app = express();
app.use(express.json());

let games = [];
let tournaments = [];

function validateGame(game) {
  if (!game.title || typeof game.title !== 'string') {
    return 'Title is required and it should be a string.';
  }
  if (!game.genre || typeof game.genre !== 'string') {
    return 'Genre is required and it should be a string.';
  }
  return null;
}

app.post('/api/games', (req, res) => {
  let error = validateGame(req.body);
  if (error) return res.status(400).send(error);

  let game = { id: games.length + 1, ...req.body };
  games.push(game);
  res.status(201).json(game);
});

function validateTournament(tournament) {
  if (!tournament.name || typeof tournament.name !== 'string') {
    return 'Name is required and it should be a string.';
  }
  if (!tournament.gameId || typeof tournament.gameId !== 'number') {
    return 'Game ID is required and it should be a number.';
  }

  if (!games.find((game) => game.id === tournament.gameId)) {
    return 'Game ID does not exist.';
  }
  return null;
}

app.post('/api/tournaments', (req, res) => {
  let error = validateTournament(req.body);
  if (error) return res.status(400).send(error);

  let tournament = { id: tournaments.length + 1, ...req.body };
  tournaments.push(tournament);
  res.status(201).json(tournament);
});

module.exports = { app, validateGame, validateTournament };
