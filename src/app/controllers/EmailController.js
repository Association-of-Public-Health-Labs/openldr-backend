import Email from '../models/Email';
import nodemailer from '../../config/mail';
import path from 'path'
import fs from 'fs'
import Queue from '../lib/Queue';

class EmailController {
    async create(req, res) {
        const email = await Email.create(req.body)
        return res.json(email)
    }

    async showByCategory (category) {
        const emails = await Email.findAll({
            where: {
                category: category,
                isActive: true
            }
        }) 
        return emails
    }

    async showByID (req, res) {
        const email = await Email.findAll({
            where: {id: req.body.id}
        }) 
        return res.json(email)
    }

    async updade (req, res) {
        const email = await Email.update(
            req.body,
            { where: { id: req.body.id } }
        )
        return res.json(email)
    }

    async destroy (req, res) {
        const email = await Email.destroy({
            where: {id: req.body.id}
        })
        return res.json(email)
    }

    async sendEmail() {
        try {
            const emails = await thisController.showByCategory('HEALTH_FACILITY')
            var files = fs.readdirSync(path.join(__dirname, '../reports/'))
            const extension = '.xlsx'
            emails.map(async (email, index) => {
                if(!files.includes(email.facility_code + extension)) return 
                
                const filepath = path.join(__dirname, '../reports/' + email.facility_code + '.xlsx')
                if(fs.existsSync(filepath) && email.isActive) {
                    const file = await fs.readFileSync(filepath)
                    try{
                        await Queue.add('ViralLoadResultReportEmail', { email });

                    }catch(error) {
                        console.log(error)
                    }
                }
            }) 
            
        } catch (error) {
            console.log(error)
        }
        
    }  
}

const thisController = module.exports = new EmailController()