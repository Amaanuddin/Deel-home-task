const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const { sequelize, Profile, Job, Contract } = require('../model');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed the database with test data
  await Profile.bulkCreate([
    {
      id: 1,
      firstName: 'Client',
      lastName: 'User',
      profession: 'Client',
      balance: 500,
      type: 'client'
    },
    {
      id: 2,
      firstName: 'Contractor',
      lastName: 'User',
      profession: 'Developer',
      balance: 100,
      type: 'contractor'
    }
  ]);

  await Contract.bulkCreate([
    {
      id: 1,
      terms: 'Test Contract',
      status: 'in_progress',
      ClientId: 1,
      ContractorId: 2
    },
    {
      id: 2,
      terms: 'Test Contract 2',
      status: 'terminated',
      ClientId: 1,
      ContractorId: 2
    }
  ]);

  await Job.bulkCreate([
    {
      id: 1,
      description: 'Test Job',
      price: 200,
      paid: false,
      paymentDate: null,
      ContractId: 1
    },
    {
      id: 2,
      description: 'Test Job 2',
      price: 300,
      paid: true,
      paymentDate: new Date(),
      ContractId: 1
    }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('API Tests', () => {
  test('GET /contracts/:id should return the contract if it belongs to the profile calling', async () => {
    const response = await request(app)
      .get('/contracts/1')
      .set('profile_id', 1); // Client User

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: 1,
      terms: 'Test Contract'
    }));
  });

  test('GET /contracts should return a list of non-terminated contracts belonging to a user', async () => {
    const response = await request(app)
      .get('/contracts')
      .set('profile_id', 1); // Client User

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        terms: 'Test Contract'
      })
    ]));
  });

  test('GET /jobs/unpaid should return all unpaid jobs for a user with active contracts', async () => {
    const response = await request(app)
      .get('/jobs/unpaid')
      .set('profile_id', 1); // Client User

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        description: 'Test Job',
        price: 200,
        paid: false
      })
    ]));
  });

  test('POST /jobs/:job_id/pay should pay for a job if client balance >= job amount', async () => {
    const response = await request(app)
      .post('/jobs/1/pay')
      .set('profile_id', 1); // Client User

    expect(response.status).toBe(200);
    expect(response.text).toEqual('Payment successful');

    const client = await Profile.findByPk(1);
    const contractor = await Profile.findByPk(2);

    expect(client.balance).toBe(300); // 500 - 200
    expect(contractor.balance).toBe(300); // 100 + 200
  });

  test('GET /admin/best-profession should return the best profession', async () => {
    const response = await request(app)
      .get('/admin/best-profession?start=2024-01-01&end=2025-01-01')
      .set('profile_id', 1); // Admin User (Assuming user ID 1 is an admin)

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        total_earned: 500
      })
    ]));
  });

  test('GET /admin/best-clients should return the best clients', async () => {
    const response = await request(app)
      .get('/admin/best-clients?start=2024-01-01&end=2025-01-01&limit=1')
      .set('profile_id', 1); // Admin User (Assuming user ID 1 is an admin)

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fullName: expect.any(String),
        paid: expect.any(Number)
      })
    ]));
  });
});
