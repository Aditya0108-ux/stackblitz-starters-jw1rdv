let express = require('express');
let app = express();
app.use(express.json());

// Recipes data
let recipes = [
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

// Helper functions for recipes
async function getAllRecipes() {
  return recipes;
}

async function getRecipeById(id) {
  return recipes.find((recipe) => recipe.id === id);
}

async function addRecipe(data) {
  data.id = recipes.length + 1; // Auto-increment ID
  recipes.push(data);
  return data;
}

// Exercise 1: Get All Recipes
// http://localhost:3000/recipes
app.get('/recipes', async (req, res) => {
  const allRecipes = await getAllRecipes();
  res.json(allRecipes);
});

// Exercise 2: Get Recipe by ID
// http://localhost:3000/recipes/details/1
app.get('/recipes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let recipe = await getRecipeById(id);
  if (!recipe) {
    return res.status(404).send('Recipe not found');
  }
  res.json(recipe);
});

// Exercise 3: Add a New Recipe
// http://localhost:3000/recipes/new
app.post('/recipes/new', async (req, res) => {
  const newRecipe = await addRecipe(req.body);
  res.status(201).json(newRecipe);
});

module.exports = {
  app,
  getAllRecipes,
  getRecipeById,
  addRecipe,
};
