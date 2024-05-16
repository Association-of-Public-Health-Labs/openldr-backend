const express = require("express");

const checkAuth = require("../../config/check-auth");

const VlDataController = require("./controllers/VlDataController");
const LaboratoryController = require("./controllers/LaboratoryController");
const DashboardController = require("./controllers/DashboardController");
const ClinicController = require("./controllers/ClinicController");
const ResultsController = require("./controllers/ResultsController");
const WeeklyReportController = require("./controllers/WeeklyReportController")
const ReportsController = require("./controllers/ReportsController")
const MonthlyReportsController = require("./controllers/MonthlyReportsController")

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

routes.get("/lab_samples_rejected", LaboratoryController.getRejectedSamples);
routes.get("/lab_samples_rejected_by_month", LaboratoryController.getSamplesRejectedByMonth);

routes.get("/lab_backlogs", LaboratoryController.getBacklogs);

routes.get("/lab_weekly_report", LaboratoryController.samples_weekly_resume_by_lab);
routes.get("/lab_weekly_report_national", LaboratoryController.samples_weekly_resume);

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

routes.get("/clinic_samples_tested_by_age", ClinicController.getSamplesTestedByAge);

routes.get(
  "/clinic_samples_tested_by_age_and_facility",
  ClinicController.getSamplesTestedByAgeAndFacility
);

routes.get(
  "/clinic_tests_by_pregnancy",
  ClinicController.getSamplesTestedByPregnancyAndFacility
);

routes.get(
  "/clinic_tests_by_breastfeeding",
  ClinicController.getSamplesTestedByBreastfeedingAndFacility
);

routes.get(
  "/clinic_registered_samples_by_facility",
  ClinicController.getRegisteredSamplesByFacility
);

routes.get("/clinic_samples_rejected_by_month", ClinicController.getSamplesRejectedByMonth)
routes.get("/clinic_samples_rejected_by_facility", ClinicController.getSamplesRejectedByFacility)

// Results routes
routes.get(
  "/results/:page/:paginate/:start/:end",
  // checkAuth,
  ResultsController.paginate
);

routes.get(
  "/result/:requestID",
  // checkAuth,
  ResultsController.index
);

routes.get(
  "/result_by_name/:fullname/:page/:paginate",
  // checkAuth,
  ResultsController.showPacient
);

routes.get(
  "/results/search/:name/:age/:gender/:page/:paginate",
  ResultsController.search_patients
);

routes.get(
  "/viralload/results/query/:page/:paginate/:query",
  checkAuth,
  ResultsController.get_patients_by_query
)

routes.get(
  "/viralload/all_patients/query/:query",
  checkAuth,
  ResultsController.get_all_patients_by_query
)

// Weekly Reports
routes.get("/weeklyreports/instrument", WeeklyReportController.getTotalIntrumentCapacity);
routes.get("/weeklyreports/instrument_samples", WeeklyReportController.getSamplesByInstrument);

routes.get("/vl/weeklyreports/samples_by_instrument", ReportsController.getTotalIntrumentCapacity);
routes.get("/vl/weeklyreports/backlogged_samples", ReportsController.getBackloggedSamples);
routes.get("/vl/weeklyreports/registered_samples", ReportsController.getRegisteredSamples);
routes.get("/vl/weeklyreports/tested_samples", ReportsController.getTestedSamples);
routes.get("/vl/weeklyreports/non_validated_samples", ReportsController.getNonValidatedSamples);
routes.get("/vl/weeklyreports/fsr_incompleteness_report/:start_date/:end_date", ReportsController.getFSRIncompletenessReport);

routes.get("/vl/weeklyreports/results/:location", ReportsController.getResultsByHealthFacility);
routes.get("/vl/weeklyreports/monitore_backlogs", ReportsController.monitoreLabBacklog);

// MonthlyReportsController
routes.get("/vl/monthlyreports/age/:start_date/:end_date", MonthlyReportsController.getVlReportByAge);
routes.get("/vl/monthlyreports/gender/:start_date/:end_date", MonthlyReportsController.getVlReportByGender);
routes.get("/vl/monthlyreports/pregnant/:start_date/:end_date", MonthlyReportsController.getVlReportForPregnant);
routes.get("/vl/monthlyreports/breastfeeding/:start_date/:end_date", MonthlyReportsController.getVlReportForBreastfeeding);
routes.get("/vl/monthlyreports/tat_by_facility/:start_date/:end_date", MonthlyReportsController.getTurnaroundTimeByFacility);
routes.get("/vl/monthlyreports/tat_by_lab/:start_date/:end_date", MonthlyReportsController.getTurnaroundTimeByLab);



module.exports = routes;
