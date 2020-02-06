import mssqlExport from 'mssql-to-csv';
import fs from 'fs';
import EID from '../models/EID';

export default {
  key: 'EIDDataExportJob',
  async handle({ data }) {
    const {samples} = data;
    const folder = 'C:/EID/';

    var dbconfig = {
        user: 'sa',
        password: 'disalab',
        server: 'localhost',
        database: 'EIDData',
        requestTimeout: 320000,
        pool: {
            max: 20,
            min: 12,
            idleTimeoutMillis: 30000
        }
    };

    var options = {
        ignoreList: ["EID"], // tables to ignore
        tables: [],                  // empty to export all the tables
        outputDirectory: folder,
        log: true,
        header: true                // true to export column names as csv header
    };

    try {
        const process = await mssqlExport(dbconfig, options)
        samples.map( async (sample) => {
            await EID.update_EID(sample.RequestID, sample.Status)
        })
        // var date = new Date(Date.now());
        // date.setSeconds(date.getSeconds() + 30);
        // // format to "yyyyMMddHHmm"
        // var dateFormat = date.toISOString().replace(/[^0-9]/g, '').substr(0, 12);
        // const filepath = folder +  'viewEIDData.csv';
        // if (fs.existsSync(filepath)) {
        //     fs.renameSync(filepath, folder + 'C:/EID/EID_' + dateFormat + '.csv')
        // }
    }catch (err) {
        console.log(err)
    }

  },
};