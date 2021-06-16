const Sequelize = require("sequelize");
const { eid } = require("../../../config/sequelize");
const sequelizePaginate = require("sequelize-paginate");

const Eid = eid.define(
  "EID",
  {
    RequestID: Sequelize.STRING,
    FIRSTNAME: Sequelize.STRING,
    SURNAME: Sequelize.STRING,
    DOB: Sequelize.DATE,
    DOBType: Sequelize.STRING,
    EID_IDNo: Sequelize.STRING,
    AgeInDays: Sequelize.INTEGER,
    AgeInYears: Sequelize.INTEGER,
    Hl7SexCode: Sequelize.STRING,
    REGISTEREDDATE: Sequelize.DATE,
    SpecimenDatetime: Sequelize.DATE,
    ReceivedDatetime: Sequelize.DATE,
    RegisteredDatetime: Sequelize.DATE,
    AnalysisDatetime: Sequelize.DATE,
    AuthorisedDatetime: Sequelize.DATE,
    RequestingProvinceName: Sequelize.STRING,
    RequestingDistrictName: Sequelize.STRING,
    RequestingFacilityCode: Sequelize.STRING,
    RequestingFacilityName: Sequelize.STRING,
    TestingProvinceName: Sequelize.STRING,
    TestingDistrictName: Sequelize.STRING,
    TestingFacilityCode: Sequelize.STRING,
    TestingFacilityName: Sequelize.STRING,
    Cuidador: Sequelize.STRING,
    Cuidador_Cell: Sequelize.STRING,
    PatientConsent: Sequelize.STRING,
    PTV_MAE: Sequelize.STRING,
    PTV_CRIANCA: Sequelize.STRING,
    EID_Date: Sequelize.STRING,
    RapidHIV: Sequelize.STRING,
    PCR_ANTERIOR: Sequelize.STRING,
    POR_SEMANAS: Sequelize.STRING,
    TIPO_DE_COLHEITA: Sequelize.STRING,
    LIMSSpecimenSourceCode: Sequelize.STRING,
    LIMSSpecimenSourceDesc: Sequelize.STRING,
    LIMSAnalyzerCode: Sequelize.STRING,
    LIMSAnalyzerDesc: Sequelize.STRING,
    PCR_Result: Sequelize.STRING,
    LIMSRejectionCode: Sequelize.STRING,
    LIMSRejectionDesc: Sequelize.STRING,
    LIMSPointOfCareDesc: Sequelize.STRING,
    RegisteredBy: Sequelize.STRING,
    TestedBy: Sequelize.STRING,
    AuthorisedBy: Sequelize.STRING,
    AttendingDoctor: Sequelize.STRING,
    DatetimeStamp: Sequelize.DATE,
    EIDServer: Sequelize.STRING,
    EIDServerDatetime: Sequelize.DATE,
    IS_DISALINK: Sequelize.STRING,
  },
  { freezeTableName: true, timestamps: false }
);

sequelizePaginate.paginate(Eid);

Eid.removeAttribute("id")
module.exports = Eid;
