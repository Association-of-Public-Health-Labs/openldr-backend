const express = require("express");

const VlDataController = require("./controllers/VlDataController");
const LaboratoryController = require("./controllers/LaboratoryController");
const DashboardController = require("./controllers/DashboardController");
const ClinicController = require("./controllers/ClinicController");

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

// Dashboard routes ...

routes.get("/dash_number_of_samples", DashboardController.getNumberOfSamples);
routes.get("/dash_viral_suppression", DashboardController.getViralSuppression);
routes.get("/dash_tat", DashboardController.getTurnAroundTime);
routes.get("/dash_map", DashboardController.getViralSuppressionMap);
routes.get("/dash_indicators", DashboardController.getSamplesIndicators);
routes.get("/dash_tat_vs_disalinks", DashboardController.getTatVsDisalinks);

// Clinic routes ...
routes.get(
  "/clinic_samples_by_test_reason",
  ClinicController.getSamplesByTestReason
);

routes.get(
  "/clinic_samples_tested_by_month",
  ClinicController.getSamplesTestedByMonth
);

routes.get(
  "/clinic_samples_tested_by_facility",
  ClinicController.getSamplesTestedByFacility
);

routes.get(
  "/clinic_samples_tested_by_gender",
  ClinicController.getSamplesTestedByGender
);

routes.get(
  "/clinic_samples_tested_by_gender_and_facility",
  ClinicController.getSamplesTestedByGenderAndFacility
);

routes.get("/clinic_tat", ClinicController.getTurnaroundTimeByMonth);

routes.get(
  "/clinic_tat_by_facility",
  ClinicController.getTurnaroundTimeByFacility
);

routes.get("/clinic_tat_by_age", ClinicController.getSamplesTestedByAge);

routes.get(
  "/clinic_tests_by_pregnancy",
  ClinicController.getSamplesTestedByPregnancy
);

routes.get(
  "/clinic_tests_by_breastfeeding",
  ClinicController.getSamplesTestedForBreastfeeding
);

module.exports = routes;
