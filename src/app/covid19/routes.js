const express = require("express");
const checkAuth = require("../../config/check-auth");

const ResultsController = require("./controllers/ResultsController");
const DashboardController = require("./controllers/DashboardController");

const routes = express.Router();

// Results
routes.get("/covid19results", checkAuth, ResultsController.show);
routes.get("/paginate/:page/:paginate", checkAuth, ResultsController.paginate);

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

module.exports = routes;
