let { DataTypes, sequelize } = require('../lib');
const { movie } = require('./movie.model');
const { user } = require('./user.model');

let like = sequelize.define('like', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
  },
  movieId: {
    type: DataTypes.INTEGER,
    references: {
      model: movie,
      key: 'id',
    },
  },
});
user.belongsToMany(movie, { through: like });
movie.belongsToMany(user, { through: like });
module.exports = { like };
