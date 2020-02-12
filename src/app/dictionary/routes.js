const express = require("express");

const ClinicController = require("./controllers/ClinicController");
const DistrictController = require("./controllers/DistrictController");
const ProvinceController = require("./controllers/ProvinceController");
const LaboratoryController = require("./controllers/LaboratoryController");

const routes = express.Router();

// Clinics
routes.get("/clinic/:id", ClinicController.show);
routes.get("/clinics", ClinicController.showAll);
routes.get("/clinics/disalinks", ClinicController.showDisalinks);
routes.get("/clinics/province/:province", ClinicController.showByProvince);
routes.get("/clinics/district/:district", ClinicController.showByDistrict);

// Districts
routes.get("/district/:district", DistrictController.show);
routes.get("/districts", DistrictController.showAll);
routes.get("/districts/province/:province", DistrictController.showByProvince);

// Provinces
routes.get("/province/:province", ProvinceController.show);
routes.get("/provinces", ProvinceController.showAll);

// Labs
routes.get("/lab/:lab", LaboratoryController.show);
routes.get("/labs", LaboratoryController.showAll);

module.exports = routes;
