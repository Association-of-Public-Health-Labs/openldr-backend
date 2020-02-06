import EmailController from './EmailController'
import ResultsControler from './ExcelReports/ResultsController'
import Queue from '../lib/Queue';

class ReportsController {
    async generate_viralload_healthfacilities_reports (req, res) {
        const CATEGORY = 'HEALTH_FACILITY'
        const facilities = await EmailController.showByCategory(CATEGORY)
        // facilities.map(async (facility, index) => {
        //     // if(index < 5) {
        //         await ResultsControler.viralload_results_foreach_facility(facility.facility_code)
        //     // }
        // })  
        await Queue.add('ViralLoadResultReport', { facilities });
        // console.log(facilities)
        return res.json(facilities)  
    }

    async generate_viralload_healthfacilities_report () {
        const CATEGORY = 'HEALTH_FACILITY'
        const facilities = await EmailController.showByCategory(CATEGORY)
        facilities.map(async (facility, index) => {
            await Queue.add('ViralLoadResultReport', { facility });
        })

    }

    async generate_viralload_monthly_lab_report () {
        const CATEGORY = 'LAB'
        const facilities = await EmailController.showByCategory(CATEGORY)
        facilities.map(async (facility, index) => {
            await Queue.add('ViralLoadMonthlyLabReport', { facility });
        })

    }

}     

module.exports = new ReportsController()