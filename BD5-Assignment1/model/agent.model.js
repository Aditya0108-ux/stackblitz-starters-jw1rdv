let { DataTypes, sequelize } = require('../lib/');
let agent = sequelize.define('agent', {
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = {
  agent,
};
