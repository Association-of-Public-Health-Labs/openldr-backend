
import sql from 'mssql'
import config from '../../config/mssql'

class Report {
    async report_viralload_samples_backlog_accumulation () {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query('SELECT * FROM [ViralLoad].[dbo].[viralload_samples_backlog_accumulation] ()')
        pool.close()
        return recordset
    }

    async report_viralload_indicators (location) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_viralload_indicators] ('" + location + "')")
        // pool.close()
        return recordset
    }

    async check_health_facility_data (location) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT COUNT(1) AS TOTAL  FROM ViralLoadData.dbo.VlData WHERE LOCATION = '"+ location +"' AND AnalysisDateTime IS NOT NULL AND ViralLoadResultCategory IS NOT NULL AND ViralLoadResultCategory <> '' AND YEAR(RegisteredDateTime) = YEAR(GETDATE()) ")
        return recordset
    }

    async report_viralload_results (location) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_viralload_results] ('" + location + "') ORDER BY registereddate DESC")
        pool.close()
        return recordset  
    }

    async report_viralload_results_temp (location) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_viralload_results_temp] ('" + location + "') ORDER BY registereddate DESC")
        pool.close()
        return recordset  
    }

    async report_turnaroudtime_by_lab (lab, startDate, endDate) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_turnaroudtime_by_lab] ('"+ lab +"','"+ startDate +"','" +endDate+ "')")
        pool.close()
        return recordset  
    }

    async report_samples_historic_by_lab (lab, startDate, endDate) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_samples_historic_by_lab] ('"+ lab +"','"+ startDate +"','" +endDate+ "')")
        pool.close()
        return recordset  
    }

    async report_vl_suppression_by_lab (lab, startDate, endDate) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_vl_suppression_by_lab] ('"+ lab +"','"+ startDate +"','" +endDate+ "')")
        pool.close()
        return recordset   
    }

    async report_incompleteness_by_lab (lab, startDate, endDate) {
        const pool = await new sql.ConnectionPool(config).connect();
        const {recordset} = await pool.query("SELECT * FROM [ViralLoad].[dbo].[report_incompleteness_by_lab] ('"+ lab +"','"+ startDate +"','" +endDate+ "')")
        pool.close()
        return recordset  
    }
}

module.exports = new Report()  