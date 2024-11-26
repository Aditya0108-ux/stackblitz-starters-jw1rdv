// Data Objects
let articles = [
  { id: 1, title: 'Introduction to JavaScript', author: 'Jane Smith' },
  { id: 2, title: 'Advanced CSS Techniques', author: 'Tom Brown' },
];

let comments = [
  { id: 1, articleId: 1, content: 'Very informative article!' },
  { id: 2, articleId: 2, content: 'Great insights on CSS!' },
];

let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Carter', email: 'bob@example.com' },
];

// Functions for Articles
function getArticles() {
  return articles;
}

function getArticleById(id) {
  return articles.find((article) => article.id === id);
}

// Functions for Comments
function getComments() {
  return comments;
}

function getCommentById(id) {
  return comments.find((comment) => comment.id === id);
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

// Export the modules
module.exports = {
  getArticles,
  getArticleById,
  getComments,
  getCommentById,
  getUserById,
};
