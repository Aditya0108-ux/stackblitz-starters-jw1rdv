const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const PORT = process.env.port || 3000;
let db;

(async () => {
  db = await open({
    filename: 'employees_database.sqlite',
    driver: sqlite3.Database,
  });
})();

/* Exercise 1: Fetch Employees by Minimum Salary
http://localhost:3000/employees/salary?minSalary=80000 */

async function filterEmployeesBySalary(minSalary) {
  let query = 'SELECT * from employees WHERE salary >= ?';
  let response = await db.all(query, [minSalary]);
  return { employees: response };
}

app.get('/employees/salary', async (req, res) => {
  try {
    let minSalary = req.query.minSalary;
    let results = await filterEmployeesBySalary(minSalary);
    if (results.employees.length === 0) {
      return res
        .status(404)
        .json({ message: 'No employees found by the minimum salary' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Exercise 2: Fetch Employees by Department and Minimum Experience
http://localhost:3000/employees/department-experience?department=Engineering&minExperience=5 */

async function filterEmployeesByDepartmentAndExperience(
  department,
  minExperience
) {
  let query =
    'SELECT * from employees WHERE department = ? AND years_of_experience >= ?';
  let response = await db.all(query, [department, minExperience]);
  return { employees: response };
}

app.get('/employees/department-experience', async (req, res) => {
  try {
    let department = req.query.department;
    let minExperience = req.query.minExperience;
    let results = await filterEmployeesByDepartmentAndExperience(
      department,
      minExperience
    );
    if (results.employees.length === 0) {
      return res.status(404).json({
        message:
          'No employees found by the department : ' +
          department +
          ' and experience greater than ' +
          minExperience,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Fetch Employees Ordered by Salary
http://localhost:3000/employees/ordered-by-salary */

async function fetchEmployeesOrderedBySalary() {
  let query = 'SELECT * from employees ORDER BY salary DESC';
  let response = await db.all(query, []);
  return { employees: response };
}

app.get('/employees/ordered-by-salary', async (req, res) => {
  try {
    let results = await fetchEmployeesOrderedBySalary();
    if (results.employees.length === 0) {
      return res
        .status(404)
        .json({ message: 'No employees Ordered By Salary' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost : ${PORT}`);
});
