const sequelize = require("sequelize");

module.exports = {
  collection_reception: [
    sequelize.fn(
      "avg",
      sequelize.fn(
        "datediff",
        sequelize.literal("day"),
        sequelize.col("SpecimenDatetime"),
        sequelize.col("ReceivedDatetime")
      )
    ),
    "collection_reception"
  ],

  reception_registration: [
    sequelize.fn(
      "avg",
      sequelize.fn(
        "datediff",
        sequelize.literal("day"),
        sequelize.col("ReceivedDatetime"),
        sequelize.col("RegisteredDatetime")
      )
    ),
    "reception_registration"
  ],

  registration_analysis: [
    sequelize.fn(
      "avg",
      sequelize.fn(
        "datediff",
        sequelize.literal("day"),
        sequelize.col("RegisteredDatetime"),
        sequelize.col("AnalysisDatetime")
      )
    ),
    "registration_analysis"
  ],

  analysis_validation: [
    sequelize.fn(
      "avg",
      sequelize.fn(
        "datediff",
        sequelize.literal("day"),
        sequelize.col("AnalysisDatetime"),
        sequelize.col("AuthorisedDatetime")
      )
    ),
    "analysis_validation"
  ],

  year: sequelize.fn("year", sequelize.col("RegisteredDatetime")),

  quarter: sequelize.fn(
    "datepart",
    sequelize.literal("QUARTER"),
    sequelize.col("RegisteredDatetime")
  ),

  month: sequelize.fn("month", sequelize.col("RegisteredDatetime")),

  month_name: sequelize.fn(
    "datename",
    sequelize.literal("MONTH"),
    sequelize.col("RegisteredDatetime")
  ),

  week: sequelize.fn(
    "datepart",
    sequelize.literal("WEEK"),
    sequelize.col("RegisteredDatetime")
  )
};
