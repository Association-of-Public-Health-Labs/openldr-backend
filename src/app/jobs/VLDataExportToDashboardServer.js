import mysql from 'mysql2'

export default {
  key: 'ViralLoadDataExportToDashboardServer',
  async handle({ data }) {
    const { records } = data;

    var connection = mysql.createConnection({
        host     : 'portalvc.dcl.org.mz',
        user     : 'dash_user',
        password : 'dash@12345',
        database : 'dash'
    });

    // var connection = mysql.createConnection({
    //     host     : '139.59.140.162',
    //     user     : 'dash_user',
    //     password : 'dash@12345',
    //     database : 'dash'
    // });
 
    connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ', err);
          return;
        }
        else {
            console.log('Connected successfuly')
        }
    });
    
    connection.query('SELECT RequestID FROM VlData', function (error, results, fields) {
        if (error) throw error;
        console.log('RequestID: ', results[0].RequestID);
    });
    
    connection.end();
  },
};