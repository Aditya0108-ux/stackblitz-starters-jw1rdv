let { DataTypes, sequelize } = require('../lib/');
let recipe = sequelize.define('recipe', {
  title: DataTypes.TEXT,
  chef: DataTypes.TEXT,
  cuisine: DataTypes.TEXT,
  preparationTime: DataTypes.INTEGER,
  instructions: DataTypes.TEXT,
});

module.exports = {
  recipe,
};
