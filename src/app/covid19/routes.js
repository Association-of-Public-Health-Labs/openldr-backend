const express = require("express");
const checkAuth = require("../../config/check-auth");

const ResultsController = require("./controllers/ResultsController");
const DashboardController = require("./controllers/DashboardController");
const ReportsController = require("./controllers/ReportsController");
const DailyController = require("./controllers/DailyReportController");
const DailyReportsController = require("./controllers/DailyReportsController");

const routes = express.Router();

// Results
routes.get("/covid19results", checkAuth, ResultsController.show);
routes.get(
  "/paginate/:page/:paginate/:start/:end",
  checkAuth,
  ResultsController.paginate
);

routes.get(
  "/numberofsamples",
  checkAuth,
  DashboardController.getNumberOfSamples
);

routes.get("/testedsamples", checkAuth, DashboardController.getTestedSamples);

routes.get(
  "/positivebyprovince",
  // checkAuth,
  DashboardController.getPositiveSamplesByProvince
);

routes.get("/report", checkAuth, DashboardController.getGlobalReport);

routes.get(
  "/samplesindicators",
  checkAuth,
  DashboardController.getIndicatorsByProvince
);

routes.get("/covid19tat", checkAuth, DashboardController.getTAT);

routes.get(
  "/covid19-by-gender",
  checkAuth,
  DashboardController.getPositiveCasesByGender
);

routes.get("/covid19/samples_by_lab", DashboardController.samplesByLab);
routes.get("/covid19/lab_tat", DashboardController.turnaroundTimeByLab);

// Reports
routes.post("/create_report", ReportsController.store);
routes.put("/update_report", ReportsController.update);
routes.get("/show_report/:email", ReportsController.show);

// Results
routes.get(
  "/results/with_contacts/:start_date/:end_date",
  ResultsController.get_patients_with_contacts
);

routes.get(
  "/sms_status_by_province/:start_date/:end_date/:province",
  ResultsController.get_patients_sms_status_by_province
);

routes.put(
  "/update_sms_status/:requestid/:status",
  ResultsController.update_sms_status
);

// Daily Reports
routes.get("/daily/resume/:startDate/:endDate", DailyController.get_resume);
routes.get(
  "/daily/reason/:start_date/:end_date",
  DailyController.reason_for_test_report
);

routes.get(
  "/daily/tat_province/:start_date/:end_date",
  DailyController.get_tat_by_province
);

routes.get(
  "/daily/tat_lab/:start_date/:end_date",
  DailyController.get_tat_by_lab
);

routes.get("/daily/results/:start_date/:end_date", DailyController.get_results);
routes.get("/covid/results/:requestid", ResultsController.search_patients);


// Daily Reports
routes.get("/covid/daily_report/resume/:start_date/:end_date", DailyReportsController.getDailyResume)
routes.get("/covid/daily_report/reason_for_test_report/:start_date/:end_date", DailyReportsController.getReasonForTestReport)
routes.get("/covid/daily_report/tat_by_province/:start_date/:end_date", DailyReportsController.get_tat_by_province)
routes.get("/covid/daily_report/tat_by_lab/:start_date/:end_date", DailyReportsController.get_tat_by_lab)
routes.get("/covid/daily_report/results/:start_date/:end_date", DailyReportsController.getDailyResults)
routes.get("/covid/daily_report/pending_results/:start_date/:end_date", DailyReportsController.getDailyPendingResults)

module.exports = routes;
