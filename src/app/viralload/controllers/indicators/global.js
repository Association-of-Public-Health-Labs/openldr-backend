const sequelize = require("sequelize");
const { fn, literal, col } = sequelize;

module.exports = {
  total: fn("count", literal("1")),

  tested: fn(
    "count",
    literal(
      `CASE WHEN AnalysisDatetime IS NOT NULL AND AnalysisDatetime <> '' THEN 1 ELSE NULL END`
    )
  ),

  rejected: fn(
    "count",
    literal(
      `CASE WHEN (LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '') OR (HIVVL_LIMSRejectionCode IS NOT NULL AND HIVVL_LIMSRejectionCode <> '') THEN 1 ELSE NULL END`
    )
  ),

  non_validated: fn(
    "count",
    literal(
      `CASE WHEN ViralLoadResultCategory IS NOT NULL AND ViralLoadResultCategory <> '' AND (AuthorisedDatetime IS NULL OR AuthorisedDatetime = '') THEN 1 ELSE NULL END`
    )
  ),

  collection_reception: fn(
    "avg",
    fn(
      "datediff",
      literal("day"),
      col("SpecimenDatetime"),
      col("ReceivedDatetime")
    )
  ),

  reception_registration: fn(
    "avg",
    fn(
      "datediff",
      literal("day"),
      col("ReceivedDatetime"),
      col("RegisteredDatetime")
    )
  ),

  registration_analysis: fn(
    "avg",
    fn(
      "datediff",
      literal("day"),
      col("RegisteredDatetime"),
      col("AnalysisDatetime")
    )
  ),

  analysis_validation: fn(
    "avg",
    fn(
      "datediff",
      literal("day"),
      col("AnalysisDatetime"),
      col("AuthorisedDatetime")
    )
  ),

  year: fn("year", col("RegisteredDatetime")),

  quarter: fn("datepart", literal("QUARTER"), col("RegisteredDatetime")),

  month: fn("month", col("RegisteredDatetime")),

  month_name: fn("datename", literal("MONTH"), col("RegisteredDatetime")),

  week: fn("datepart", literal("WEEK"), col("RegisteredDatetime")),

  routine: fn(
    "count",
    literal(`CASE WHEN ReasonForTest IN ('Routine') THEN 1 ELSE NULL END`)
  ),
  treatment_failure: fn(
    "count",
    literal(
      `CASE WHEN ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapêutica') THEN 1 ELSE NULL END`
    )
  ),
  reason_not_specified: fn(
    "count",
    literal(
      `CASE WHEN ReasonForTest IN ('Não preenchido','Reason Not Specified') THEN 1 ELSE NULL END`
    )
  ),
  suppressed: fn(
    "count",
    literal(
      `CASE WHEN ViralLoadResultCategory = 'Suppressed' THEN 1 ELSE NULL END`
    )
  ),
  non_suppressed: fn(
    "count",
    literal(
      `CASE WHEN ViralLoadResultCategory = 'Not Suppressed' THEN 1 ELSE NULL END`
    )
  ),
  male_suppressed: fn(
    "count",
    literal(
      `CASE WHEN Hl7SexCode = 'M' AND ViralLoadResultCategory = 'Suppressed' THEN 1 ELSE NULL END`
    )
  ),

  female_suppressed: fn(
    "count",
    literal(
      `CASE WHEN Hl7SexCode = 'F' AND ViralLoadResultCategory = 'Suppressed' THEN 1 ELSE NULL END`
    )
  ),

  male_not_suppressed: fn(
    "count",
    literal(
      `CASE WHEN Hl7SexCode = 'M' AND ViralLoadResultCategory = 'Not Suppressed' THEN 1 ELSE NULL END`
    )
  ),

  female_not_suppressed: fn(
    "count",
    literal(
      `CASE WHEN Hl7SexCode = 'F' AND ViralLoadResultCategory = 'Not Suppressed' THEN 1 ELSE NULL END`
    )
  ),
};
