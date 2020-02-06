import Mail from '../lib/Mail';
import ResultsControler from '../controllers/ExcelReports/ResultsController'
import Email from '../models/Email';
import path from 'path'
import fs from 'fs'

export default {
  key: 'ViralLoadResultReportEmail',
  async handle({ data }) {
    const {email} = data;

    const filepath = path.join(__dirname, '../reports/' + email.facility_code + '.xlsx')
    const file = await fs.readFileSync(filepath)

    let info = await Mail.sendMail({
        from: '"Resultados de Carga Viral" <aphlmoz@gmail.com>', // sender address
        to: email.email, // list of receivers  
        subject: 'Resultados de Carga Viral', // Subject line
        text: null, // plain text body
        html: 'Saudações,<br/><br/>Queira por favor, receber em anexo o ficheiro em Excel com os resultados de Carga Viral.'+
        'Este email foi gerado automaticamente pelo Sistema, agradecemos que não responda.' +
        'Em caso de dúvidas ou esclarecimentos, entre em contacto pelos emails: solon.kidane@moz.aphl.org / vagner.ermelindo@moz.aphl.org<br/><br/>Melhores cumprimentos', // html body
        attachments: [
            {filename: email.facility_code + '.xlsx', content: file }
        ]
    });

  },
};