import cron from 'node-cron'
import ExportsController from '../controllers/ExportsController'

cron.schedule('1 7 * * *', () => {
    ExportsController.exportEIDtoCSV()
})