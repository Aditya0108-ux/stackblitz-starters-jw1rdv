let { getEmployees, getEmployeeById, addEmployee } = require('./employee');
const express = require('express');
let app = express();
const PORT = 3000;

app.use(express.json());

app.get('/employees', (req, res) => {
  res.json(getEmployees());
});

app.get('/employees/:id', (req, res) => {
  const employee = getEmployeeById(parseInt(req.params.id));
  if (!employee) return res.status(404).json('Employee not found');
  res.json(employee);
});

app.post('/employees', (req, res) => {
  const employee = addEmployee(req.body);
  res.status(201).json(employee);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
