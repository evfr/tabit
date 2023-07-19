const axios = require('axios');
const app = require('../server');
const MongoClient = require('mongodb').MongoClient;
const test_port = 3001;
const dbUrl = process.env.MONGO_URI;

const dbClient = new MongoClient(dbUrl);
jest.setTimeout(10000);

async function initializeDb() {
  await dbClient.connect(dbUrl);
  return dbClient.db("1st");
}

describe('Tests', () => {
  let db;

  let server;

  beforeAll(async() => {
    server = app.listen(test_port);
    db = await initializeDb();
  });

  afterAll(async () => {
    await global.conn.close();
    await server.close();
  });

  it('should respond with userId and gameId', async () => {
    const url = `http://localhost:${test_port}/start`;
    const data = {
      user: 'John Doe',
    };

    const response = await axios.post(url, data);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('userId');
    expect(response.data).toHaveProperty('gameId');
  });

  it('should respond with an error when user name not supplied', async () => {
    const url = `http://localhost:${test_port}/start`;
    const data = {
      stam: 'nothing',
    };
    let response;

    try {
      response = await axios.post(url, data);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe('very bad request');      
    }
  });

  it('should respond with a roll result - currentScore', async () => {
    // create a game first
    const url1 = `http://localhost:${test_port}/start`;
    const data1 = {
      user: 'John Doe',
    };

    const response1 = await axios.post(url1, data1);
    const gameId = response1.data.gameId;

    const url2 = `http://localhost:${test_port}/roll`;
    const data2 = {
      gameId
    };

    const response2 = await axios.post(url2, data2);
    expect(response2.status).toBe(200);
    expect(response2.data).toHaveProperty('currentScore');
  });

  it('should respond with an error when the "gameId" parmeter not supplied', async () => {
    const url = `http://localhost:${test_port}/roll`;
    const data = {
      gameId: ''
    };

    try {
      await axios.post(url, data);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe('very bad request');      
    }
  });
});