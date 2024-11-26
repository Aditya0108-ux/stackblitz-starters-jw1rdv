let { getProducts, getProductById, addProduct } = require('./product');
const express = require('express');
let app = express();
const PORT = 3000;

app.use(express.json());

// Product routes
app.get('/products', (req, res) => {
  res.json(getProducts());
});

app.get('/products/:id', (req, res) => {
  const product = getProductById(parseInt(req.params.id));
  if (!product) return res.status(404).json('Product not found');
  res.json(product);
});

app.post('/products', (req, res) => {
  const product = addProduct(req.body);
  res.status(201).json(product);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
