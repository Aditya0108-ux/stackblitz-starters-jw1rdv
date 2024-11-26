let express = require('express');
const { sequelize } = require('./lib/');
const { recipe } = require('./model/recipe.model');
const { user } = require('./model/user.model');
let { like } = require('./model/favorite.model');
let { Op } = require('@sequelize/core');
const { favorite } = require('./model/favorite.model');
let app = express();

app.use(express.json()); //cors

let recipes =
  // recipes
  [
    {
      title: 'Spaghetti Carbonara',
      chef: 'Chef Luigi',
      cuisine: 'Italian',
      preparationTime: 30,
      instructions:
        'Cook spaghetti. In a bowl, mix eggs, cheese, and pepper. Combine with pasta and pancetta.',
    },
    {
      title: 'Chicken Tikka Masala',
      chef: 'Chef Anil',
      cuisine: 'Indian',
      preparationTime: 45,
      instructions:
        'Marinate chicken in spices and yogurt. Grill and serve with a creamy tomato sauce.',
    },
    {
      title: 'Sushi Roll',
      chef: 'Chef Sato',
      cuisine: 'Japanese',
      preparationTime: 60,
      instructions:
        'Cook sushi rice. Place rice on nori, add fillings, roll, and slice into pieces.',
    },
    {
      title: 'Beef Wellington',
      chef: 'Chef Gordon',
      cuisine: 'British',
      preparationTime: 120,
      instructions:
        'Wrap beef fillet in puff pastry with mushroom duxelles and bake until golden.',
    },
    {
      title: 'Tacos Al Pastor',
      chef: 'Chef Maria',
      cuisine: 'Mexican',
      preparationTime: 50,
      instructions:
        'Marinate pork in adobo, grill, and serve on tortillas with pineapple and cilantro.',
    },
  ];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await recipe.bulkCreate(recipes);
    await user.create({
      username: 'foodlover',
      email: 'foodlover@example.com',
      password: 'securepassword',
    });
    res.status(200).json({ message: 'Database Seeding Successful' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

/* Exercise 1: Favorite a Recipe
http://localhost:3000/users/1/favorite?recipeId=2 */

async function favoriteRecipe(data) {
  let newFavorite = await favorite.create({
    userId: data.userId,
    recipeId: data.recipeId,
  });
  return { message: 'Recipe favorited ', newFavorite };
}

app.get('/users/:id/favorite', async (req, res) => {
  try {
    let userId = req.params.id;
    let recipeId = req.query.recipeId;
    let response = await favoriteRecipe({ userId, recipeId });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*Exercise 2: Unfavorite a Recipe
http://localhost:3000/users/1/unfavorite?recipeId=2 */

async function dislikeRecipe(data) {
  let count = await favorite.destroy({
    where: {
      userId: data.userId,
      recipeId: data.recipeId,
    },
  });

  if (count === 0) return {};

  return { message: 'Recipe Disliked' };
}

app.get('/users/:id/unfavorite', async (req, res) => {
  try {
    let userId = req.params.id;
    let recipeId = req.query.recipeId;
    let response = await dislikeRecipe({ userId, recipeId });
    if (!response.message) {
      return res
        .status(404)
        .json({ message: 'This recipe is not in your liked list' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Get All Favorited Recipes
http://localhost:3000/users/1/favorites */

async function getAllFavoritedRecipes(userId) {
  let recipeIds = await favorite.findAll({
    where: { userId },
    attributes: ['recipeId'],
  });
  console.log(recipeIds);

  let recipeRecords = [];
  for (let i = 0; i < recipeIds.length; i++) {
    recipeRecords.push(recipeIds[i].recipeId);
  }
  console.log(recipeRecords);

  let likedRecipes = await recipe.findAll({
    where: { id: { [Op.in]: recipeRecords } },
  });
  return { likedRecipes };
}

app.get('/users/:id/favorites', async (req, res) => {
  try {
    let userId = req.params.id;
    let response = await getAllFavoritedRecipes(userId);
    if (response.likedRecipes.length === 0) {
      return res.status(404).json({ message: 'No liked recipes found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost : 3000`);
});
