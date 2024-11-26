const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const PORT = process.env.port || 3000;
let db;

(async () => {
  db = await open({
    filename: 'kitchen_database.sqlite',
    driver: sqlite3.Database,
  });
})();

/* Exercise 1: Fetch Kitchen Items by Minimum Rating
http://localhost:3000/kitchen-items/rating?minRating=4 */

async function filterKitchenItemsByRating(minRating) {
  let query = 'SELECT * from kitchen_items WHERE rating > ?';
  let response = await db.all(query, [minRating]);
  return { kitchenItems: response };
}

app.get('/kitchen-items/rating', async (req, res) => {
  try {
    let minRating = req.query.minRating;
    let results = await filterKitchenItemsByRating(minRating);
    if (results.kitchenItems.length === 0) {
      return res
        .status(404)
        .json({ message: 'No kitchen items found by the minimum rating' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Exercise 2: Fetch Kitchen Items by Material and Rating
http://localhost:3000/kitchen-items/material-rating?material=plastic&minRating=3 */

async function filterKitchenItemsByMaterialRating(material, rating) {
  let query = 'SELECT * from kitchen_items  WHERE material = ? AND rating > ?';
  let response = await db.all(query, [material, rating]);
  return { kitchenItems: response };
}

app.get('/kitchen-items/material-rating', async (req, res) => {
  try {
    let material = req.query.material;
    let minRating = req.query.minRating;
    let results = await filterKitchenItemsByMaterialRating(material, minRating);
    if (results.kitchenItems.length === 0) {
      return res.status(404).json({
        message:
          'No kitchen items found by the material : ' +
          material +
          ' and rating greater than ' +
          minRating,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Fetch Kitchen Items Ordered by Price
http://localhost:3000/kitchen-items/ordered-by-price */

async function fetchKitchenItemsOrderedByPrice() {
  let query = 'SELECT * from kitchen_items ORDER BY price DESC';
  let response = await db.all(query, []);
  return { kitchenItems: response };
}

app.get('/kitchen-items/ordered-by-price', async (req, res) => {
  try {
    let results = await fetchKitchenItemsOrderedByPrice();
    if (results.kitchenItems.length === 0) {
      return res
        .status(404)
        .json({ message: 'No kitchen items Ordered By price' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost : ${PORT}`);
});
