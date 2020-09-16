const express = require("express");
const checkAuth = require("../../config/check-auth");

const ResultsController = require("./controllers/ResultsController");
const DashboardController = require("./controllers/DashboardController");
const ReportsController = require("./controllers/ReportsController");

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

module.exports = routes;
