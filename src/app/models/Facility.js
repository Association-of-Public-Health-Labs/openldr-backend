const sql = require('mssql')
const config = require('../config/mssql')

class Facility {
    async gethealthfacilities () {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query('SELECT FacilityCode, HealthcareDistrictCode, HealthCareID, ProvinceName, DistrictName, [Description] FROM [OpenLDRDict].[dbo].[viewFacilities]')
        pool.close()
        return recordset
    }

    async gethealthfacility (id) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT FacilityCode, HealthcareDistrictCode, HealthCareID, ProvinceName, DistrictName, [Description] FROM [OpenLDRDict].[dbo].[viewFacilities] WHERE FacilityCode = '"+ id +"'")
        pool.close()
        return recordset
    }
}

module.exports = new Report()  