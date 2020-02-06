
import LabReportsController from '../controllers/ExcelReports/LabReportsController'

export default {
  key: 'ViralLoadMonthlyLabReport',
  async handle({ data }) {
    const {facility} = data;
    var today = new Date();
    var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const endDate = lastDayOfMonth.toISOString().split('T')[0]
    const startDate =endDate.substring(0,8).concat('01')

    if(typeof facility === 'undefined') return
    await LabReportsController.vl_monthly_report(facility.facility_code, facility.facility_name, startDate, endDate)
  },
};