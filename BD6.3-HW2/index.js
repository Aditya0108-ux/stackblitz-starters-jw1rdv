let express = require('express');
let app = express();
app.use(express.json());

// Employees data
let employees = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
  },
];

// Helper functions for employees
async function getAllEmployees() {
  return employees;
}

async function getEmployeeById(id) {
  return employees.find((employee) => employee.id === id);
}

async function addEmployee(data) {
  data.id = employees.length + 1; // Auto-increment ID
  employees.push(data);
  return data;
}

// Exercise 1: Get All Employees
// http://localhost:3000/employees
app.get('/employees', async (req, res) => {
  const allEmployees = await getAllEmployees();
  res.json(allEmployees);
});

// Exercise 2: Get Employee by ID
// http://localhost:3000/employees/details/1
app.get('/employees/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let employee = await getEmployeeById(id);
  if (!employee) {
    return res.status(404).send('Employee not found');
  }
  res.json(employee);
});

// Exercise 3: Add a New Employee
// http://localhost:3000/employees/new
app.post('/employees/new', async (req, res) => {
  const newEmployee = await addEmployee(req.body);
  res.status(201).json(newEmployee);
});

module.exports = {
  app,
  getAllEmployees,
  getEmployeeById,
  addEmployee,
};
