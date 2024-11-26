const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

let employees = [
  { id: 1, name: 'John Doe', position: 'Software Engineer' },
  { id: 2, name: 'Jane Smith', position: 'Product Manager' },
  { id: 3, name: 'Sam Johnson', position: 'Designer' },
];

function getEmployees() {
  return employees;
}

function getEmployeeById(id) {
  return employees.find((employee) => employee.id === id);
}

function addEmployee(employee) {
  employees.push(employee);
  return employee;
}

app.get('/employees', (req, res) => {
  res.json(getEmployees());
});

app.get('/employees/details/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let employee = getEmployeeById(id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send('Employee not found');
  }
});

app.post('/employees/new', (req, res) => {
  let { id, name, position } = req.body;
  let addedEmployee = addEmployee({ id, name, position });
  res.status(201).json(addedEmployee);
});

module.exports = {
  app,
  getEmployees,
  getEmployeeById,
  addEmployee,
};
