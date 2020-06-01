const express = require("express");

const ResultsController = require("./controllers/ResultsController");
const DashboardController = require("./controllers/DashboardController");

const routes = express.Router();

// Results
routes.get("/covid19results", ResultsController.show);
routes.get("/paginate/:page/:paginate", ResultsController.paginate);

routes.get("/numberofsamples", DashboardController.getNumberOfSamples);
routes.get("/testedsamples", DashboardController.getTestedSamples);
routes.get(
  "/positivebyprovince",
  DashboardController.getPositiveSamplesByProvince
);
routes.get("/report", DashboardController.getGlobalReport);
routes.get("/covid19tat", DashboardController.getTAT);

module.exports = routes;
