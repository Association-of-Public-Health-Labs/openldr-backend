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
  checkAuth,
  DashboardController.getPositiveSamplesByProvince
);
routes.get("/report", checkAuth, DashboardController.getGlobalReport);
routes.get("/covid19tat", checkAuth, DashboardController.getTAT);
routes.get(
  "/covid19-by-gender",
  checkAuth,
  DashboardController.getPositiveCasesByGender
);

// Reports
routes.post("/create_report", ReportsController.store);
routes.put("/update_report", ReportsController.update);
routes.get("/show_report/:email", ReportsController.show);

module.exports = routes;
