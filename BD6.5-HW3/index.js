const express = require('express');
const app = express();
app.use(express.json());

let articles = [
  {
    id: 1,
    title: 'Understanding JavaScript',
    content:
      'JavaScript is a versatile language used for both frontend and backend development.',
  },
  {
    id: 2,
    title: 'Introduction to React',
    content:
      'React is a popular JavaScript library for building user interfaces.',
  },
];

let authors = [
  {
    id: 1,
    name: 'John Doe',
    articleId: 1,
  },
  {
    id: 2,
    name: 'Jane Smith',
    articleId: 2,
  },
];

function validateArticle(article) {
  if (!article.title || typeof article.title !== 'string') {
    return 'Title is required and it should be a string.';
  }
  if (!article.content || typeof article.content !== 'string') {
    return 'Content is required and it should be a string.';
  }
  return null;
}

app.post('/api/articles', (req, res) => {
  const error = validateArticle(req.body);
  if (error) return res.status(400).send(error);

  const article = { id: articles.length + 1, ...req.body };
  articles.push(article);
  res.status(201).json(article);
});

function validateAuthor(author) {
  if (!author.name || typeof author.name !== 'string') {
    return 'Name is required and it should be a string.';
  }
  if (!author.articleId || typeof author.articleId !== 'number') {
    return 'Article ID is required and it should be a number.';
  }
  if (!articles.find((article) => article.id === author.articleId)) {
    return 'Article ID does not exist.';
  }
  return null;
}

app.post('/api/authors', (req, res) => {
  const error = validateAuthor(req.body);
  if (error) return res.status(400).send(error);

  const author = { id: authors.length + 1, ...req.body };
  authors.push(author);
  res.status(201).json(author);
});

module.exports = { app, validateArticle, validateAuthor };
