const express = require("express");

const VlDataController = require("./controllers/VlDataController");

const routes = express.Router();

routes.get("/sample/:id", VlDataController.show);

module.exports = routes;
