import express from "express";

import VlDataController from "./controllers/VlDataController";

const routes = express.Router();

routes.get("/sample/:id", VlDataController.show);

module.exports = routes;
