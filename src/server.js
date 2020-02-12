require("dotenv/config");
const express = require("express");
// import BullBoard from "bull-board";
// import Queue from "./app/lib/Queue";
// import "./app/schedules/VlResultReportSchecule";
// import "./app/schedules/VlResultsSendEmail";
// import './app/schedules/EIDServerSchedule';
// import './app/schedules/VLMonthlyLabReport';
// import './app/schedules/VlDashboardSync'
// import Routes from "./routes";
const ViralLoadRoutes = require("./app/viralload/routes");
const DictRoutes = require("./app/dictionary/routes");

const app = express();
// BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

app.use(express.json());
// app.use(Schedule)

// app.use("/admin/queues", BullBoard.UI);
// app.use(Routes);
app.use(ViralLoadRoutes);
app.use(DictRoutes);
app.listen(process.env.PORT || 4444, () => {
  console.log("Server running on localhost:4444");
});
