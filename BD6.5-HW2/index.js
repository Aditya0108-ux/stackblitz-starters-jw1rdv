const express = require('express');
const app = express();
app.use(express.json());

let companies = [];
let employees = [];

function validateCompany(company) {
  if (!company.name || typeof company.name !== 'string') {
    return 'Name is required and it should be a string.';
  }
  return null;
}

app.post('/api/companies', (req, res) => {
  let error = validateCompany(req.body);
  if (error) return res.status(400).send(error);

  let company = { id: companies.length + 1, ...req.body };
  companies.push(company);
  res.status(201).json(company);
});

function validateEmployee(employee) {
  if (!employee.name || typeof employee.name !== 'string') {
    return 'Name is required and it should be a string.';
  }
  if (!employee.companyId || typeof employee.companyId !== 'number') {
    return 'Company ID is required and it should be a number.';
  }

  if (!companies.find((company) => company.id === employee.companyId)) {
    return 'Company ID does not exist.';
  }
  return null;
}

app.post('/api/employees', (req, res) => {
  let error = validateEmployee(req.body);
  if (error) return res.status(400).send(error);

  let employee = { id: employees.length + 1, ...req.body };
  employees.push(employee);
  res.status(201).json(employee);
});

module.exports = { app, validateCompany, validateEmployee };
