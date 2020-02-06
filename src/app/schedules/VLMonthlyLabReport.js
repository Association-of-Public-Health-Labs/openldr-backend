import cron from 'node-cron'
import ReportsController from '../controllers/ReportsController'

cron.schedule('*/2 * * * *', () => {
    ReportsController. generate_viralload_monthly_lab_report () 
})