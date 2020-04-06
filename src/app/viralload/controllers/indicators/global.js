const sequelize = require("sequelize");
const { fn, literal, col } = sequelize;

module.exports = {
  total: fn("count", literal("1")),
  collection_reception: [
    fn(
      "avg",
      fn(
        "datediff",
        literal("day"),
        col("SpecimenDatetime"),
        col("ReceivedDatetime")
      )
    ),
    "collection_reception"
  ],

  reception_registration: [
    fn(
      "avg",
      fn(
        "datediff",
        literal("day"),
        col("ReceivedDatetime"),
        col("RegisteredDatetime")
      )
    ),
    "reception_registration"
  ],

  registration_analysis: [
    fn(
      "avg",
      fn(
        "datediff",
        literal("day"),
        col("RegisteredDatetime"),
        col("AnalysisDatetime")
      )
    ),
    "registration_analysis"
  ],

  analysis_validation: [
    fn(
      "avg",
      fn(
        "datediff",
        literal("day"),
        col("AnalysisDatetime"),
        col("AuthorisedDatetime")
      )
    ),
    "analysis_validation"
  ],

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
  )
};
