import cron from 'node-cron'
import ReportsController from '../controllers/ReportsController'

// cron.schedule('0 9 * * 1', () => {
//     ReportResultsController.generate_viralload_healthfacilities_report()
// })


cron.schedule('1 9 * * 1', () => {
    ReportsController.generate_viralload_healthfacilities_report()
}) 