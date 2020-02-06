import Mail from '../lib/Mail';
import ResultsControler from '../controllers/ExcelReports/ResultsController'

export default {
  key: 'ViralLoadResultReport',
  async handle({ data }) {
    const {facility} = data;
    // facilities.map(async (facility, index) => {
        // if(index < 5) {
            if(typeof facility === 'undefined') return
            await ResultsControler.viralload_results_foreach_facility(facility.facility_code)
            console.log(facility.facility_code)
        // }
    // }) 
  },
};