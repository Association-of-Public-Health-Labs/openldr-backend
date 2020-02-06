import express from 'express'

const routes = express.Router()

import ResultsController from './app/controllers/ExcelReports/ResultsController'
import LabReportsController from './app/controllers/ExcelReports/LabReportsController'
import EmailController from './app/controllers/EmailController'
import ReportsController from './app/controllers/ReportsController'
import ExportsController from './app/controllers/ExportsController'

routes.get('/excel', ResultsController.viralload_results_foreach_facility)

// Email routes
routes.get('/email', EmailController.showByID)
routes.get('/emailcategory', EmailController.showByCategory)
routes.post('/email', EmailController.create)
routes.put('/email', EmailController.updade)
routes.delete('/email', EmailController.destroy)
// routes.get('/send', EmailController.sendEmail)
routes.get('/export', ExportsController.exportEIDtoCSV)

// routes.get('/labreport', LabReportsController.vl_monthly_report)

// ReportResults routes
routes.get('/reportresults', ReportsController.generate_viralload_healthfacilities_reports)

module.exports = routes  