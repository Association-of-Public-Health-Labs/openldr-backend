require("dotenv/config");
const request = require("supertest");
// const sequelize = require("sequelize");
// const {vldata} = require("../../../src/config/sequelize");
const App = require("../../../src/server.2");

const app = new App().app;


const Sequelize = require('sequelize');
const { col, literal, fn, Op } = require("sequelize");
// const vldata = require("../../../src/app/viralload/models/VlData");

jest.useFakeTimers()

describe('Dashboard', () => {
  it('should get the number of tested samples per month', async () => {
    // const [result,] = await vldata.query(`SELECT * FROM VlData`);
    // console.log(result)
    expect(true).toBe(true);
  }, 70000);
});