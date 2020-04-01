const express = require("express");

const VlDataController = require("./controllers/VlDataController");

const routes = express.Router();

routes.get("/sample/:id", VlDataController.show);
routes.get("/samples", VlDataController.getNumberOfSamplesByMonth);
routes.get("/tat", VlDataController.getTatByLab);

routes.get("/suppression", VlDataController.getSuppression);

routes.get("/sampleshistory", VlDataController.getSamples);

module.exports = routes;
