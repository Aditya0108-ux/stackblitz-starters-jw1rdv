let { DataTypes, sequelize } = require('../lib');
const { recipe } = require('./recipe.model');
const { user } = require('./user.model');

let favorite = sequelize.define('favorite', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    references: {
      model: recipe,
      key: 'id',
    },
  },
});
user.belongsToMany(recipe, { through: favorite });
recipe.belongsToMany(user, { through: favorite });
module.exports = { favorite };
