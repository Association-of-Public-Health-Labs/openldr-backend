import Sequelize from "sequelize";
import { facilities } from "../../../config/sequelize";

const Facilities = facilities.define(
  "viewFacilities",
  {
    DateTimeStamp: Sequelize.DATE,
    VersionStamp: Sequelize.STRING,
    FacilityCode: Sequelize.STRING,
    Description: Sequelize.STRING,
    FacilityType: Sequelize.STRING,
    CountryCode: Sequelize.STRING,
    ProvinceCode: Sequelize.STRING,
    RegionCode: Sequelize.STRING,
    DistrictCode: Sequelize.STRING,
    SubDistrictCode: Sequelize.STRING,
    LattLong: Sequelize.GEOGRAPHY,
    HFStatus: Sequelize.INTEGER,
    HealthCareID: Sequelize.STRING,
    FacilityNationalCode: Sequelize.STRING,
    HealthcareCountryCode: Sequelize.STRING,
    HealthcareProvinceCode: Sequelize.STRING,
    HealthcareDistrictCode: Sequelize.STRING,
    CountryName: Sequelize.STRING,
    CountryLattLong: Sequelize.GEOGRAPHY,
    ProvinceName: Sequelize.STRING,
    ProvinceLattLong: Sequelize.GEOGRAPHY,
    DistrictName: Sequelize.STRING,
    DistrictLattLong: Sequelize.GEOGRAPHY
  },
  { freezeTableName: true, timestamps: false }
);
Facilities.removeAttribute("id");
facilities.sync();
module.exports = Facilities;
