let {
  getArticles,
  getArticleById,
  getComments,
  getCommentById,
  getUserById,
} = require('./article');
const express = require('express');
const app = express();

app.use(express.json());

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticles();
    if (articles.length === 0) {
      return res.status(404).json({ error: 'No articles found.' });
    }
    return res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await getArticleById(parseInt(req.params.id));
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    return res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all comments
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await getComments();
    if (comments.length === 0) {
      return res.status(404).json({ error: 'No comments found.' });
    }
    return res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get comment by ID
app.get('/api/comments/:id', async (req, res) => {
  try {
    const comment = await getCommentById(parseInt(req.params.id));
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    return res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUserById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = { app };
