const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Properties Endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`Unauthorized requests`, () => {
    const testUsers = helpers.makeUsersArray();
    const testProperties = helpers.makePropertiesArray(testUsers);

    beforeEach('insert users', () => {
      return db.into('collegevine_users').insert(testUsers);
    });

    beforeEach('insert colleges', () => {
      return db.into('collegevine_colleges').insert(testProperties);
    });

    it('responds with 401 Unauthorized for GET /api/colleges', () => {
      return supertest(app)
        .get('/api/colleges')
        .expect(401, { error: 'Missing bearer token' });
    });

    it(`responds with 401 Unauthorized for POST /api/colleges`, () => {
      return supertest(app)
        .post('/api/colleges')
        .send({
          address: 'Fake Test St',
          city: 'Testtown',
          state: 'CA',
          status: 'rented',
          rent_price: '1000',
          initial_price: '1000000',
          mortgage_payment: '500',
          date_created: '2029-01-22T16:28:32.615Z',
          user_id: testUsers[1].id,
        })
        .expect(401, { error: 'Missing bearer token' });
    });

    it(`responds with 401 Unauthorized for GET /api/colleges/:property_id`, () => {
      const secondCollege = testProperties[1];
      return supertest(app)
        .get(`/api/colleges/${secondCollege.id}`)
        .expect(401, { error: 'Missing bearer token' });
    });

    it(`responds with 401 Unauthorized for PATCH /api/colleges/:property_id`, () => {
      const secondCollege = testProperties[1];
      return supertest(app)
        .patch(`/api/colleges/${secondCollege.id}`)
        .expect(401, { error: 'Missing bearer token' });
    });

    it(`responds with 401 Unauthorized for DELETE /api/colleges/:property_id`, () => {
      const aCollege = testProperties[1];
      return supertest(app)
        .delete(`/api/colleges/${aCollege.id}`)
        .expect(401, { error: 'Missing bearer token' });
    });
  });

  describe(`GET /api/colleges`, () => {
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];
    const testProperties = helpers.makePropertiesArray(testUsers);

    beforeEach(() => helpers.seedUsers(db, testUsers));

    context(`Given no colleges`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/colleges')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, []);
      });
    });

    context('Given there are colleges in the database', () => {
      beforeEach('insert colleges', () =>
        helpers.seedProperties(db, testProperties),
      );

      it('responds with 200 and all of the colleges', () => {
        const expectedProperties = helpers.makeExpectedProperties(
          testUser,
          testProperties,
        );

        return supertest(app)
          .get('/api/colleges')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedProperties);
      });
    });

    context(`Given an XSS attack article`, () => {
      const { maliciousCollege, expectedCollege } =
        helpers.makeMaliciousCollege(testUser);

      beforeEach('insert malicious property', () => {
        return helpers.seedMaliciousCollege(db, maliciousCollege);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/colleges`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body[0].address).to.eql(expectedCollege.address);
            expect(res.body[0].city).to.eql(expectedCollege.city);
          });
      });
    });
  });

  describe(`GET /api/colleges/:property_id`, () => {
    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];
    const testProperties = helpers.makePropertiesArray(testUsers);

    beforeEach(() => helpers.seedUsers(db, testUsers));

    context(`Given no colleges`, () => {
      it(`responds with 404`, () => {
        const propertyId = 123456;
        return supertest(app)
          .get(`/api/colleges/${propertyId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: `College doesn't exist` });
      });
    });

    context('Given there are colleges in the database', () => {
      beforeEach('insert colleges', () =>
        helpers.seedProperties(db, testProperties),
      );

      it('responds with 200 and the specified property', () => {
        const propertyId = 2;
        const expectedCollege = {
          id: 2,
          address: '2 Test St',
          city: 'Testtown',
          state: 'CA',
          status: 'rented',
          rent_price: 1000,
          initial_price: 1000000,
          mortgage_payment: 500,
          date_created: '2029-01-22T16:28:32.615Z',
          user_id: 2,
        };

        return supertest(app)
          .get(`/api/colleges/${propertyId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedCollege);
      });
    });

    context(`Given an XSS attack article`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousCollege, expectedCollege } =
        helpers.makeMaliciousCollege(testUser);

      beforeEach('insert malicious property', () => {
        return helpers.seedMaliciousCollege(db, maliciousCollege);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/colleges/${expectedCollege.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body.address).to.eql(expectedCollege.address);
            expect(res.body.city).to.eql(expectedCollege.city);
          });
      });
    });
  });
});
