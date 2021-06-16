const express = require("express");
const ReportsController = require("./controllers/ReportsController")
const routes = express.Router();

routes.get("/eid/weeklyreports/samples_by_instrument", ReportsController.getTotalIntrumentCapacity)
routes.get("/eid/weeklyreports/backlogged_samples", ReportsController.getBackloggedSamples)
routes.get("/eid/weeklyreports/registered_samples", ReportsController.getRegisteredSamples)
routes.get("/eid/weeklyreports/tested_samples", ReportsController.getTestedSamples)
routes.get("/eid/weeklyreports/non_validated_samples", ReportsController.getNonValidatedSamples)

routes.get("/eid/weeklyreports/results/:location", ReportsController.getResultsByHealthFacility)

module.exports = routes

