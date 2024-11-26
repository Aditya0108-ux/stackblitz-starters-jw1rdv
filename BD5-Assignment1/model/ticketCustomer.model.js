let { DataTypes, sequelize } = require('../lib');
const { ticket } = require('./ticket.model');
const { customer } = require('./customer.model');

let ticketCustomer = sequelize.define('ticketCustomer', {
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: customer,
      key: 'id',
    },
  },
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: ticket,
      key: 'id',
    },
  },
});
ticket.belongsToMany(customer, { through: ticketCustomer });
customer.belongsToMany(ticket, { through: ticketCustomer });
module.exports = { ticketCustomer };
