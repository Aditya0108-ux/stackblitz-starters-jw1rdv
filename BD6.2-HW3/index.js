const express = require('express');
const app = express();

app.use(express.json());

let products = [
  { id: 1, name: 'Laptop', category: 'Electronics' },
  { id: 2, name: 'Coffee Maker', category: 'Appliances' },
  { id: 3, name: 'Headphones', category: 'Electronics' },
  { id: 4, name: 'Running Shoes', category: 'Footwear' },
];

function getProducts() {
  return products;
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function addProduct(product) {
  products.push(product);
  return product;
}

app.get('/products', (req, res) => {
  res.json(getProducts());
});

app.get('/products/details/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let product = getProductById(id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

app.post('/products/new', (req, res) => {
  let { id, name, category } = req.body;
  let addedProduct = addProduct({ id, name, category });
  res.status(201).json(addedProduct);
});

module.exports = {
  app,
  getProducts,
  getProductById,
  addProduct,
};
