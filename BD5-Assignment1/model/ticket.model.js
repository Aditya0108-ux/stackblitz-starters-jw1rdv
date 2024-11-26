let { DataTypes, sequelize } = require('../lib/');
let ticket = sequelize.define('ticket', {
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  status: DataTypes.TEXT,
  priority: DataTypes.INTEGER,
  customerId: DataTypes.INTEGER,
  agentId: DataTypes.INTEGER,
});

module.exports = {
  ticket,
};
