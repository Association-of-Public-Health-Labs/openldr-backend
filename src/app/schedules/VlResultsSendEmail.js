import cron from 'node-cron'
import EmailController from '../controllers/EmailController'

cron.schedule('1 11 * * 2', () => {
    EmailController.sendEmail()
})