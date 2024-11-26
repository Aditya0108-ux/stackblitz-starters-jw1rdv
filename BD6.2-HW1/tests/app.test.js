let {
  app,
  getEmployees,
  getEmployeeById,
  addEmployee,
} = require('../index.js');
let http = require('http');

jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  getEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
  addEmployee: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(2550, done);
});

afterAll((done) => {
  server.close(done);
});

describe('Employee Function Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('getEmployees should return a list of employees', () => {
    const mockEmployees = [
      { id: 1, name: 'John Doe', position: 'Software Engineer' },
      { id: 2, name: 'Jane Smith', position: 'Product Manager' },
      { id: 3, name: 'Sam Johnson', position: 'Designer' },
    ];

    // Mock the implementation of getEmployees
    getEmployees.mockReturnValue(mockEmployees);

    let result = getEmployees();
    expect(result).toEqual(mockEmployees);
    expect(getEmployees).toHaveBeenCalled();
  });

  test('getEmployeeById should return employee details', () => {
    const mockEmployee = {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
    };
    getEmployeeById.mockReturnValue(mockEmployee);

    let result = getEmployeeById(1);
    expect(result).toEqual(mockEmployee);
    expect(getEmployeeById).toHaveBeenCalledWith(1);
  });

  test('getEmployeeById should return undefined if employee id not found', () => {
    getEmployeeById.mockReturnValue(undefined);

    let result = getEmployeeById(999);
    expect(result).toBeUndefined();
    expect(getEmployeeById).toHaveBeenCalledWith(999);
  });

  test('addEmployee should add a new employee', () => {
    const newEmployee = {
      id: 4,
      name: 'Emily Davis',
      position: 'Marketing Manager',
    };

    addEmployee.mockReturnValue(newEmployee);
    let result = addEmployee(newEmployee);
    expect(result).toEqual(newEmployee);
    expect(addEmployee).toHaveBeenCalledWith(newEmployee);
  });
});
