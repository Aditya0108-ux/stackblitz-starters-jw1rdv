const cors = require('cors');
const express = require('express');
const app = express();

const { getAllMovies, getMovieById } = require('./controllers');

app.use(cors());
app.use(express.json());

// Endpoint to get all movies
app.get('/movies', async (req, res) => {
  const movies = getAllMovies();
  res.json({ movies });
});

// Endpoint to get movie details by ID
app.get('/movies/details/:id', async (req, res) => {
  const movie = getMovieById(parseInt(req.params.id));
  if (movie) {
    res.json({ movie });
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

module.exports = { app };
