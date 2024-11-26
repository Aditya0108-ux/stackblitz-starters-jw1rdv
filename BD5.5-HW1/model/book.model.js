let { DataTypes, sequelize } = require('../lib/');
let book = sequelize.define('book', {
  title: DataTypes.TEXT,
  author: DataTypes.TEXT,
  genre: DataTypes.TEXT,
  year: DataTypes.INTEGER,
  summary: DataTypes.TEXT,
});

module.exports = {
  book,
};
