const express = require("express");

const VlDataController = require("./controllers/VlDataController");
const LaboratoryController = require("./controllers/LaboratoryController");

const routes = express.Router();

routes.get("/sample/:id", VlDataController.show);
routes.get("/samples", VlDataController.getNumberOfSamplesByMonth);
routes.get("/tat", VlDataController.getTatByLab);

routes.get("/suppression", VlDataController.getSuppression);

routes.get("/sampleshistory", VlDataController.getSamples);

// Laboratory Routes ...
routes.get(
  "/lab_samples_by_test_reason",
  LaboratoryController.getSamplesByTestReason
);

module.exports = routes;
