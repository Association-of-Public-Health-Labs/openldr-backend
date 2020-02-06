
import sql from 'mssql'
import config from '../../config/mssql'

class ViralLoad {
    async get_records_from_viralload_database () {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT TOP 1 * FROM [ViralLoadData].[dbo].[viewVLForDashboard]")
        pool.close()
        return recordset
    }
}

module.exports = new ViralLoad()  