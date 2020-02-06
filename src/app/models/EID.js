
import sql from 'mssql'
import config from '../../config/mssql'

class EID {
    async all_samples_from_viewEID () {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT RequestID, CASE WHEN (PCR_Result IS NOT NULL AND PCR_Result <> '') OR (LIMSRejectionCode <> '' AND LIMSRejectionCode IS NOT NULL) THEN 'SENT' ELSE 'PENDING' END [Status] FROM [EIDData].[dbo].[EIDData]")
        pool.close()
        return recordset
    }

    async update_EID (requestID, sample_status) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("UPDATE [EIDData].dbo.EID SET EIDServer = '" + sample_status + "', EIDServerDatetime = GETDATE() WHERE RequestID = '" + requestID + "'")
        pool.close()
        return recordset
    }
}

module.exports = new EID()  