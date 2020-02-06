import cron from 'node-cron'
import ExportsController from '../controllers/ExportsController'

cron.schedule('*/2 * * * *', () => {
    ExportsController.exportVLDataToDashboardServer() 
})