let { DataTypes, sequelize } = require('../lib');
const { ticket } = require('./ticket.model');
const { agent } = require('./agent.model');

let ticketAgent = sequelize.define('ticketAgent', {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: ticket,
      key: 'id',
    },
  },
  agentId: {
    type: DataTypes.INTEGER,
    references: {
      model: agent,
      key: 'id',
    },
  },
});
ticket.belongsToMany(agent, { through: ticketAgent });
agent.belongsToMany(ticket, { through: ticketAgent });
module.exports = { ticketAgent };