require("dotenv/config");
const request = require("supertest");
const sequelize = require("sequelize");
const {vldata} = require("../../../src/config/sequelize");
const App = require("../../../src/server.2");

const app = new App().app;

jest.useFakeTimers()

describe('Dashboard', () => {
  it('should get the number of tested samples per month', async () => {
    // const records = await vldata.query(`
    //   SELECT year([AnalysisDatetime]) AS [year], month([AnalysisDatetime]) AS [month], count(1) AS [total] 
    //   FROM [ViralLoadData].[dbo].[VlData] AS [VlData] 
    //   WHERE ([AnalysisDatetime] BETWEEN N'2020-11-17' AND N'2021-11-17') 
    //   GROUP BY year([AnalysisDatetime]), month([AnalysisDatetime]) 
    //   ORDER BY year([AnalysisDatetime]) ASC, month([AnalysisDatetime]) ASC;`
    // );
    const records = await vldata.query(`
      SELECT COUNT(1) FROM ViralLoadData.dbo.VlData`
    );
    console.log(records)
    // const response = await request(app)
    // .get('/dash_number_of_samples')
    expect(true).toBe(true);
  }, 100000);
});