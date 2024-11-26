let {
  getEmployees,
  getEmployeeById,
  getDepartments,
  getDepartmentById,
} = require('./employee');
const express = require('express');
const app = express();

app.use(express.json());

// Route to get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await getEmployees();
    if (employees.length === 0) {
      return res.status(404).json({ error: 'No employees found.' });
    }
    return res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server error' });
  }
});

// Route to get a specific employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await getEmployeeById(parseInt(req.params.id));
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await getDepartments();
    if (departments.length === 0) {
      return res.status(404).json({ error: 'No departments found.' });
    }
    return res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server error' });
  }
});

// Route to get a specific department by ID
app.get('/api/departments/:id', async (req, res) => {
  try {
    const department = await getDepartmentById(parseInt(req.params.id));
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    return res.json(department);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = { app };
