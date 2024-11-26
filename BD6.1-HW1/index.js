let { getMovies, getMovieById, addMovie } = require('./movie');
const express = require('express');
let app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/movies', (req, res) => {
  res.json(getMovies());
});

app.get('/api/movies/:id', (req, res) => {
  const movie = getMovieById(parseInt(req.params.id));
  if (!movie) return res.status(404).json('Movie not found');
  res.json(movie);
});

app.post('/api/movies', (req, res) => {
  const movie = addMovie(req.body);
  res.status(201).json(movie);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
