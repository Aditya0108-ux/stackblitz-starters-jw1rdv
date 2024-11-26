let express = require('express');
const { sequelize } = require('./lib/');
const { book } = require('./model/book.model');
const { user } = require('./model/user.model');
let { like } = require('./model/like.model');
let { Op } = require('@sequelize/core');
let app = express();

app.use(express.json());

// books
let books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    year: 1960,
    summary: 'A novel about the serious issues of rape and racial inequality.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    year: 1949,
    summary:
      'A novel presenting a dystopian future under a totalitarian regime.',
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    year: 1851,
    summary:
      'The narrative of the sailor Ishmael and the obsessive quest of Ahab.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    year: 1813,
    summary:
      'A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    year: 1925,
    summary: 'A novel about the American dream and the roaring twenties.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(books);
    await user.create({
      username: 'booklover',
      email: 'booklover@gmail.com',
      password: 'password123',
    });
    res.status(200).json({ message: 'Database Seeding Successful' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

/* Exercise 1: Like a Book
http://localhost:3000/users/1/like?bookId=2 */

async function likeBook(data) {
  let newLike = await like.create({
    userId: data.userId,
    bookId: data.bookId,
  });
  return { message: 'Book Liked', newLike };
}

app.get('/users/:id/like', async (req, res) => {
  try {
    let userId = req.params.id;
    let bookId = req.query.bookId;
    let response = await likeBook({ userId, bookId });
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 2: Dislike a Book
http://localhost:3000/users/1/dislike?bookId=2 */

async function dislikeBook(data) {
  let count = await like.destroy({
    where: {
      userId: data.userId,
      bookId: data.bookId,
    },
  });

  if (count === 0) return {};

  return { message: 'Book Disliked' };
}

app.get('/users/:id/dislike', async (req, res) => {
  try {
    let userId = req.params.id;
    let bookId = req.query.bookId;
    let response = await dislikeBook({ userId, bookId });
    if (!response.message) {
      res.status(404).json({ message: 'This Book is not in your liked list' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Get All Liked Tracks
http://localhost:3000/users/1/liked */

async function getAllLikedBooks(userId) {
  let bookIds = await like.findAll({
    where: { userId },
    attributes: ['bookId'],
  });
  //console.log(bookIds);

  let bookRecords = [];
  for (let i = 0; i < bookIds.length; i++) {
    bookRecords.push(bookIds[i].bookId);
  }
  //console.log(bookRecords);

  let likedBooks = await book.findAll({
    where: { id: { [Op.in]: bookRecords } },
  });
  return { likedBooks };
}

app.get('/users/:id/liked', async (req, res) => {
  try {
    let userId = req.params.id;
    let response = await getAllLikedBooks(userId);
    if (response.likedBooks.length === 0) {
      return res.status(404).json({ message: 'No liked books found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost : 3000`);
});
