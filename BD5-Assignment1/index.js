let express = require('express');
const { sequelize } = require('./lib/');
const { ticket } = require('./model/ticket.model');
const { customer } = require('./model/customer.model');
const { agent } = require('./model/agent.model');
let { ticketCustomer } = require('./model/ticketCustomer.model');
let { ticketAgent } = require('./model/ticketAgent.model');

let { Op } = require('@sequelize/core');
let app = express();

app.use(express.json()); //cors

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    let tickets = await ticket.bulkCreate([
      {
        title: 'Login Issue',
        description: 'Cannot login to account',
        status: 'open',
        priority: 1,
        customerId: 1,
        agentId: 1,
      },
      {
        title: 'Payment Failure',
        description: 'Payment not processed',
        status: 'closed',
        priority: 2,
        customerId: 2,
        agentId: 2,
      },
      {
        title: 'Bug Report',
        description: 'Found a bug in the system',
        status: 'open',
        priority: 3,
        customerId: 1,
        agentId: 1,
      },
    ]);

    let customers = await customer.bulkCreate([
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ]);

    let agents = await agent.bulkCreate([
      { name: 'Charlie', email: 'charlie@example.com' },
      { name: 'Dave', email: 'dave@example.com' },
    ]);

    await ticketCustomer.bulkCreate([
      { ticketId: tickets[0].id, customerId: customers[0].id },
      { ticketId: tickets[2].id, customerId: customers[0].id },
      { ticketId: tickets[1].id, customerId: customers[1].id },
    ]);

    await ticketAgent.bulkCreate([
      { ticketId: tickets[0].id, agentId: agents[0].id },
      { ticketId: tickets[2].id, agentId: agents[0].id },
      { ticketId: tickets[1].id, agentId: agents[1].id },
    ]);

    res.status(200).json({ message: 'Database Seeding Successful' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

async function getTicketCustomers(ticketId) {
  const ticketCustomers = await ticketCustomer.findAll({
    where: { ticketId },
  });

  let customerData = [];
  for (let cus of ticketCustomers) {
    const customerInfo = await customer.findOne({
      where: { id: cus.customerId },
    });
    if (customerInfo) {
      customerData.push(customerInfo);
    }
  }

  return customerData;
}

async function getTicketAgents(ticketId) {
  const ticketAgents = await ticketAgent.findAll({
    where: { ticketId },
  });

  let agentData = [];
  for (let ag of ticketAgents) {
    const agentInfo = await agent.findOne({ where: { id: ag.agentId } });
    if (agentInfo) {
      agentData.push(agentInfo);
    }
  }

  return agentData;
}

async function getTicketDetails(ticketData) {
  const customers = await getTicketCustomers(ticketData.id);
  const agents = await getTicketAgents(ticketData.id);

  return {
    ...ticketData.dataValues,
    customers,
    agents,
  };
}

/* Exercise 1: Get All Tickets
http://localhost:3000/tickets */

app.get('/tickets', async (req, res) => {
  try {
    const ticketsData = await ticket.findAll();
    const detailedTickets = [];
    for (let ticketData of ticketsData) {
      const detailedTicket = await getTicketDetails(ticketData);
      detailedTickets.push(detailedTicket);
    }
    return res.status(200).json(detailedTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 2: Get Ticket by ID
http://localhost:3000/tickets/details/1*/

app.get('/tickets/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    const ticketData = await ticket.findOne({ where: { id } });
    if (!ticketData) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    let response = await getTicketDetails(ticketData);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Get Tickets by Status
http://localhost:3000/tickets/status/closed*/

app.get('/tickets/status/:status', async (req, res) => {
  try {
    let status = req.params.status;
    const ticketsData = await ticket.findAll({ where: { status } });
    if (ticketsData.length === 0) {
      return res
        .status(404)
        .json({ message: `No tickets found for status ${status}` });
    }
    let detailedTickets = [];
    for (let ticketData of ticketsData) {
      let response = await getTicketDetails(ticketData);
      detailedTickets.push(response);
    }
    return res.status(200).json(detailedTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 4: Get Tickets Sorted by Priority
http://localhost:3000/tickets/sort-by-priority*/

app.get('/tickets/sort-by-priority', async (req, res) => {
  try {
    const ticketsData = await ticket.findAll({ order: [['priority', 'ASC']] });
    if (ticketsData.length === 0) {
      return res.status(404).json({ message: 'No tickets found' });
    }
    const detailedTickets = [];
    for (const ticketData of ticketsData) {
      const details = await getTicketDetails(ticketData);
      detailedTickets.push(details);
    }
    return res.status(200).json(detailedTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 5: Add a New Ticket
http://localhost:3000/tickets/new*/

app.post('/tickets/new', async (req, res) => {
  try {
    let ticketsData = req.body.newTicket;
    if (!ticketsData) {
      return res.status(400).json({ message: 'Ticket data is required' });
    }
    const newTicket = await ticket.create(ticketsData);
    const details = await getTicketDetails(newTicket);
    return res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 6: Update Ticket Details
  http://localhost:3000/tickets/update/1 */

app.post('/tickets/update/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const updateData = req.body;

    const ticketData = await ticket.findOne({ where: { id: ticketId } });

    if (!ticketData) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (updateData.title) ticketData.title = updateData.title;
    if (updateData.description) ticketData.description = updateData.description;
    if (updateData.status) ticketData.status = updateData.status;
    if (updateData.priority) ticketData.priority = updateData.priority;

    if (updateData.customerId) {
      await ticketCustomer.destroy({ where: { ticketId: ticketData.id } });
      await ticketCustomer.create({
        ticketId: ticketData.id,
        customerId: updateData.customerId,
      });
    }

    if (updateData.agentId) {
      await ticketAgent.destroy({ where: { ticketId: ticketData.id } });
      await ticketAgent.create({
        ticketId: ticketData.id,
        agentId: updateData.agentId,
      });
    }
    await ticketData.save();
    let response = await getTicketDetails(ticketData);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Exercise 7: Delete a Ticket
http://localhost:3000/tickets/delete*/

app.post('/tickets/delete', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Valid Ticket ID is required' });
    }

    const ticketData = await ticket.findOne({ where: { id } });

    if (!ticketData) {
      return res
        .status(404)
        .json({ message: `Ticket with ID ${id} not found` });
    }

    await ticketCustomer.destroy({ where: { ticketId: id } });
    await ticketAgent.destroy({ where: { ticketId: id } });
    await ticketData.destroy();

    return res
      .status(200)
      .json({ message: `Ticket with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
