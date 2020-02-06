import 'dotenv/config';
import express from 'express';
import UserController from './app/controllers/UserController';
import BullBoard from 'bull-board';
import Queue from './app/lib/Queue';
import './app/schedules/VlResultReportSchecule';
import './app/schedules/VlResultsSendEmail';
// import './app/schedules/EIDServerSchedule';
// import './app/schedules/VLMonthlyLabReport';
// import './app/schedules/VlDashboardSync'
import Routes from './routes';

const app = express();
BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

app.use(express.json());  
// app.use(Schedule)
// app.post('/users', UserController.store); 

app.use('/admin/queues', BullBoard.UI);
app.use(Routes);
app.listen(4444, () => {   
  console.log('Server running on localhost:4444');
});