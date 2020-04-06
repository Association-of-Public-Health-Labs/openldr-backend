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

routes.get(
  "/lab_samples_tested_by_month",
  LaboratoryController.getSamplesTestedByMonth
);

routes.get(
  "/lab_samples_tested_by_lab",
  LaboratoryController.getSamplesTestedByLab
);

routes.get("/lab_tat_by_month", LaboratoryController.getTurnaroundTimeByMonth);

routes.get("/lab_tat", LaboratoryController.getTurnaroundTimeByLab);

routes.get(
  "/lab_samples_tested_by_gender",
  LaboratoryController.getSamplesTestedByGender
);

routes.get(
  "/lab_samples_tested_by_gender_and_labs",
  LaboratoryController.getSamplesTestedByGenderAndLab
);

routes.get(
  "/lab_samples_tested_by_age",
  LaboratoryController.getSamplesTestedByAge
);

routes.get(
  "/lab_samples_tested_pregnant",
  LaboratoryController.getSamplesTestedByPregnancy
);

routes.get(
  "/lab_samples_tested_breastfeeding",
  LaboratoryController.getSamplesTestedForBreastfeeding
);

module.exports = routes;
