const request = require('supertest');
const { app, validateCompany, validateEmployee } = require('../index.js');
const http = require('http');
let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints to add Data', () => {
  it('should add a new company with valid input', async () => {
    const res = await request(server)
      .post('/api/companies')
      .send({ name: 'TechCorp' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 1,
      name: 'TechCorp',
    });
  });

  it('should return 400 from invalid company input', async () => {
    const res = await request(server).post('/api/companies').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Name is required and it should be a string.');
  });

  it('should add a new employee with valid input', async () => {
    const res = await request(server)
      .post('/api/employees')
      .send({ name: 'John Doe', companyId: 1 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      id: 1,
      name: 'John Doe',
      companyId: 1,
    });
  });

  it('should return 400 from invalid employee input', async () => {
    const res = await request(server).post('/api/employees').send({
      name: 'John Doe',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(
      'Company ID is required and it should be a number.'
    );
  });

  it('should return 400 if company ID does not exist', async () => {
    const res = await request(server).post('/api/employees').send({
      name: 'Jane Doe',
      companyId: 99,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Company ID does not exist.');
  });
});

describe('Validation Functions', () => {
  it('should validate company input correctly', () => {
    expect(validateCompany({ name: 'TechCorp' })).toBeNull();
    expect(validateCompany({})).toEqual(
      'Name is required and it should be a string.'
    );
  });

  it('should validate employee input correctly', () => {
    expect(validateEmployee({ name: 'John Doe', companyId: 1 })).toBeNull();
    expect(validateEmployee({ name: 'John Doe' })).toEqual(
      'Company ID is required and it should be a number.'
    );
    expect(validateEmployee({ companyId: 1 })).toEqual(
      'Name is required and it should be a string.'
    );
    expect(validateEmployee({ name: 'Jane Doe', companyId: 99 })).toEqual(
      'Company ID does not exist.'
    );
  });
});
