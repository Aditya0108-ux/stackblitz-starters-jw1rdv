let { DataTypes, sequelize } = require('../lib/');
let customer = sequelize.define('customer', {
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = {
  customer,
};
