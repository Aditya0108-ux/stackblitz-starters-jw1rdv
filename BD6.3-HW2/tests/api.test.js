const request = require('supertest');
const {
  app,
  getAllEmployees,
  getEmployeeById,
  addEmployee,
} = require('../index.js');
const http = require('http');
const {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll,
} = require('@jest/globals');

jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  getAllEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
  addEmployee: jest.fn(),
}));

let server;

beforeAll((done) => {
  jest.setTimeout(10000);
  server = http.createServer(app);
  server.listen(3002, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints for Employees', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all employees', async () => {
    const mockEmployees = [
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

    getAllEmployees.mockResolvedValue(mockEmployees);

    const result = await request(server).get('/employees');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockEmployees);
  });

  // Test for getting a specific employee by ID
  it('should retrieve a specific employee by id', async () => {
    const mockEmployee = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Engineering',
    };

    getEmployeeById.mockResolvedValue(mockEmployee);

    const result = await request(server).get('/employees/details/1');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockEmployee);
  });

  // Test for adding a new employee
  it('should add a new employee', async () => {
    const mockEmployee = {
      id: 3,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      department: 'Sales',
    };

    addEmployee.mockResolvedValue(mockEmployee);

    const result = await request(server).post('/employees/new').send({
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      department: 'Sales',
    });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockEmployee);
  });

  // Test for non-existing employee (404)
  it('should return 404 for non-existing employee', async () => {
    getEmployeeById.mockResolvedValue(null);

    const res = await request(server).get('/employees/details/999');
    expect(res.statusCode).toEqual(404);
  });
});
