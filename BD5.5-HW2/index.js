let express = require('express');
const { sequelize } = require('./lib/');
const { movie } = require('./model/movie.model');
const { user } = require('./model/user.model');
let { like } = require('./model/like.model');
let { Op } = require('@sequelize/core');
let app = express();

app.use(express.json()); //cors

// movies
let movies = [
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    year: 2010,
    summary:
      'A skilled thief is given a chance at redemption if he can successfully perform an inception.',
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    genre: 'Crime',
    year: 1972,
    summary:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genre: 'Crime',
    year: 1994,
    summary:
      'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.',
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action',
    year: 2008,
    summary:
      'When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    genre: 'Drama',
    year: 1994,
    summary:
      'The presidencies of Kennedy and Johnson, the Vietnam War, and other events unfold from the perspective of an Alabama man with an IQ of 75.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await movie.bulkCreate(movies);
    await user.create({
      username: 'moviefan',
      email: 'moviefan@gmail.com',
      password: 'password123',
    });
    res.status(200).json({ message: 'Database Seeding Successful' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

/* Exercise 1: Like a Movie
http://localhost:3000/users/1/like?movieId=2 */

async function likeMovie(data) {
  let newLike = await like.create({
    userId: data.userId,
    movieId: data.movieId,
  });
  return { message: 'Movie Liked', newLike };
}

app.get('/users/:id/like', async (req, res) => {
  try {
    let userId = req.params.id;
    let movieId = req.query.movieId;
    let response = await likeMovie({ userId, movieId });
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*Exercise 2: Dislike a Movie
http://localhost:3000/users/1/dislike?movieId=2 */

async function dislikeMovie(data) {
  let count = await like.destroy({
    where: {
      userId: data.userId,
      movieId: data.movieId,
    },
  });

  if (count === 0) return {};

  return { message: 'Movie Disliked' };
}

app.get('/users/:id/dislike', async (req, res) => {
  try {
    let userId = req.params.id;
    let movieId = req.query.movieId;
    let response = await dislikeMovie({ userId, movieId });
    if (!response.message) {
      return res
        .status(404)
        .json({ message: 'This movie is not in your liked list' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Get All Liked Movies
http://localhost:3000/users/1/liked */

async function getAllLikedMovies(userId) {
  let movieIds = await like.findAll({
    where: { userId },
    attributes: ['movieId'],
  });
  //console.log(movieIds);

  let movieRecords = [];
  for (let i = 0; i < movieIds.length; i++) {
    movieRecords.push(movieIds[i].movieId);
  }
  //console.log(movieRecords);

  let likedMovies = await movie.findAll({
    where: { id: { [Op.in]: movieRecords } },
  });
  return { likedMovies };
}

app.get('/users/:id/liked', async (req, res) => {
  try {
    let userId = req.params.id;
    let response = await getAllLikedMovies(userId);
    if (response.likedMovies.length === 0) {
      return res.status(404).json({ message: 'No liked movies found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost : 3000`);
});
