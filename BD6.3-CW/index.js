let express = require('express');
let app = express();
app.use(express.json());

let reviews = [
  { id: 1, content: 'Great product!', userId: 1 },
  { id: 2, content: 'Not bad, could be better.', userId: 2 },
];

let users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

async function getAllReviews() {
  return reviews;
}

async function getReviewById(id) {
  return reviews.find((review) => review.id === id);
}

async function addReview(data) {
  data.id = reviews.length + 1;
  reviews.push(data);
  return data;
}

async function getUserById(id) {
  return users.find((user) => user.id === id);
}

async function addUser(data) {
  data.id = users.length + 1;
  users.push(data);
  return data;
}

/*Exercise 1: Get All Reviews 
http://localhost:3000/reviews */

app.get('/reviews', async (req, res) => {
  const reviews = await getAllReviews();
  res.json(reviews);
});

/* Exercise 2: Get Review by ID
http://localhost:3000/reviews/details/1 */

app.get('/reviews/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let review = await getReviewById(id);
  if (!review) {
    return res.status(404).send('Review not found');
  }
  res.json(review);
});

/* Exercise 3: Add a New Review
http://localhost:3000/reviews/new */

app.post('/reviews/new', async (req, res) => {
  const newReview = await addReview(req.body);
  res.status(201).json(newReview);
});

/* Exercise 4: Get User by ID
http://localhost:3000/users/details/1 */

app.get('/users/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let user = await getUserById(id);
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.json(user);
});

/* Exercise 5: Add a New User
http://localhost:3000/users/new */

app.post('/users/new', async (req, res) => {
  const newUser = await addUser(req.body);
  res.status(201).json(newUser);
});

module.exports = {
  app,
  getAllReviews,
  getReviewById,
  addReview,
  getUserById,
  addUser,
};
