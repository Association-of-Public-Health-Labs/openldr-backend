
import EID from '../models/EID';
import ViralLoad from '../models/ViralLoad';
import Queue from '../lib/Queue';

class ExportsController {
    async exportEIDtoCSV (req,res) {
        const samples = await EID.all_samples_from_viewEID()

        await Queue.add('EIDDataExportJob', { samples });
     
    }

    async exportVLDataToDashboardServer(req, res) {
        const records = await ViralLoad.get_records_from_viralload_database()
        console.log(records)
        await Queue.add('ViralLoadDataExportToDashboardServer', { records });
    }

}

const thisController = module.exports = new ExportsController()