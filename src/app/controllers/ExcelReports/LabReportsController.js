import Excel from "exceljs";
import sql from "mssql";
import config from "../../../config/mssql";
import path from "path";

// Models
import Report from "../../models/Report";

// Controllers
import ExcelController from "../ExcelController";

import {
  tatWorksheet,
  viralLoadWorksheet,
  samplesWorksheet,
  incompletenessWorksheet
} from "../../ExcelReports/LabMonthlyReport";

class LabReportsController {
  async vl_monthly_report(location, location_name, startDate, endDate) {
    // const location = "PCA";
    // const startDate = "2019-10-01";
    // const endDate = "2019-10-31";

    var workbook = new Excel.Workbook();

    // thisController.tatWorksheet(workbook, location, startDate, endDate);

    var worksheet = workbook.addWorksheet("Info", {
      views: [{ showGridLines: false }]
    });

    thisController.createMOHHeader(workbook, worksheet, location_name);

    worksheet = workbook.addWorksheet("Tempo de Resposta", {
      views: [{ showGridLines: false }]
    });

    worksheet.columns = tatWorksheet.columns;

    ExcelController.createHeader(
      worksheet,
      tatWorksheet.header,
      tatWorksheet.headerStyle
    );

    var recordset = await Report.report_turnaroudtime_by_lab(
      location,
      startDate,
      endDate
    );

    recordset.map(async row => {
      await worksheet.addRow({
        NAME: row.NAME,
        COLLECTION_TO_RECEIVE: row.COLLECTION_TO_RECEIVE,
        RECEIVE_TO_REGISTER: row.RECEIVE_TO_REGISTER,
        REGISTER_TO_ANALYSIS: row.REGISTER_TO_ANALYSIS,
        ANALYSIS_TO_AUTHORISE: row.ANALYSIS_TO_AUTHORISE,
        TOTAL:
          row.COLLECTION_TO_RECEIVE +
          row.RECEIVE_TO_REGISTER +
          row.REGISTER_TO_ANALYSIS +
          row.ANALYSIS_TO_AUTHORISE
      });
    });

    ExcelController.createBorders(worksheet, tatWorksheet.border);

    // Add the second worksheet

    worksheet = workbook.addWorksheet("Supressão Viral", {
      properties: { font: { name: "Calibri" } },
      views: [{ state: "frozen", ySplit: 1 }]
    });

    worksheet.columns = viralLoadWorksheet.columns;

    ExcelController.createHeader(
      worksheet,
      viralLoadWorksheet.header,
      viralLoadWorksheet.headerStyle
    );

    ExcelController.headerAlignment(worksheet, viralLoadWorksheet.header);

    // setting the height of header: 50
    worksheet.getRow(1).height = 50;

    recordset = await Report.report_vl_suppression_by_lab(
      location,
      startDate,
      endDate
    );

    recordset.map(async row => { 
      await worksheet.addRow({
        CATEGORY: row.CATEGORY,
        INDICATOR: row.INDICATOR,
        TOTAL: row.TOTAL,
        SUPPRESSED: row.SUPPRESSED,
        NOT_SUPPRESSED: row.NOT_SUPPRESSED,
        ROUTINE_SUP: row.ROUTINE_SUP,
        ROUTINE_NOT_SUP: row.ROUTINE_NOT_SUP,
        STF_SUP: row.STF_SUP,
        STF_NOT_SUP: row.STF_NOT_SUP,
        RAB_SUP: row.RAB_SUP,
        RAB_NOT_SUP: row.RAB_NOT_SUP,
        RNS_SUP: row.RNS_SUP,
        RNS_NOT_SUP: row.RNS_NOT_SUP
      });
    });

    ExcelController.createBorders(worksheet, viralLoadWorksheet.border);

    // Add the third worksheet: Samples Worksheet

    worksheet = workbook.addWorksheet("Histórico das Amostras", {
      properties: { font: { name: "Calibri" } },
      views: [{ state: "frozen", ySplit: 1 }]
    });

    worksheet.columns = samplesWorksheet.columns;

    ExcelController.createHeader(
      worksheet,
      samplesWorksheet.header,
      samplesWorksheet.headerStyle
    );

    ExcelController.headerAlignment(worksheet, samplesWorksheet.header);

    // setting the height of header: 50
    // worksheet.getRow(1).height = 50;

    recordset = await Report.report_samples_historic_by_lab( 
      location,
      startDate,
      endDate
    );

    recordset.map(async row => { 
      await worksheet.addRow({
        PROVINCE: row.PROVINCE,
        DISTRICT: row.DISTRICT,
        FACILITY: row.FACILITY,
        REGISTERED: row.REGISTERED,
        DBS: row.DBS,
        PLASMA: row.PLASMA,
        TESTED: row.TESTED,
        REJECTED: row.REJECTED
      });
    });

    ExcelController.createBorders(worksheet, samplesWorksheet.border);

    // Add the fourth worksheet: Incompleteness Worksheet

    worksheet = workbook.addWorksheet("Incompletude do FSR", {
      properties: { font: { name: "Calibri" } },
      views: [{ state: "frozen", ySplit: 1 }]
    });

    worksheet.columns = incompletenessWorksheet.columns;

    ExcelController.createHeader(
      worksheet,
      incompletenessWorksheet.header,
      incompletenessWorksheet.headerStyle
    );

    ExcelController.headerAlignment(worksheet, incompletenessWorksheet.header);

    // setting the height of header: 50
    // worksheet.getRow(1).height = 50;

    recordset = await Report.report_incompleteness_by_lab( 
      location,
      startDate,
      endDate
    );

    console.log(location, startDate, endDate)

    recordset.map(async row => { 
      await worksheet.addRow({
        PROVINCE: row.PROVINCE,
        DISTRICT: row.DISTRICT,
        FACILITY: row.FACILITY,
        REGISTERED: row.REGISTERED,
        NID: row.NID,
        SPECIMEN_DATE: row.SPECIMEN_DATE,
        RECEIVE_DATE: row.RECEIVE_DATE,
        GENDER: row.GENDER,
        AGE: row.AGE,
        REGIMEN: row.REGIMEN,
        REASON_FOR_TEST: row.REASON_FOR_TEST,
        PREGNANT: row.PREGNANT,
        BREASTFEEDING: row.BREASTFEEDING,
        TREATMENT_LINE: row.TREATMENT_LINE,
      });
    });

    ExcelController.createBorders(worksheet, incompletenessWorksheet.border);

    await workbook.xlsx.writeFile(
      path.join(
        __dirname,
        "../../reports/Labs/" +
          location +
          "-" +
          new Date().toISOString().replace(/:/g, "-") +
          ".xlsx"
      )
    );
  }

  async createMOHHeader(workbook,worksheet, labName) {
    // Create a header
    worksheet.mergeCells('A2:A4')
        worksheet.mergeCells('B2:F2')
        worksheet.mergeCells('B3:F3')
        worksheet.mergeCells('B4:F4')
        worksheet.getCell('B2').value = 'Republica de Mocambique'
        worksheet.getCell('B3').value = 'Ministerio da Saude'
        worksheet.getCell('B4').value = labName
        worksheet.getCell('B2').style = {
            alignment: {horizontal: 'left', vertical: 'middle'},
            font: {
                bold: true,
                size: 14  
            }
        }
        worksheet.getCell('B3').style = {
            alignment: {horizontal: 'left', vertical: 'middle'},
            font: {
                size: 14
            }
        }
        worksheet.getCell('B4').style = {
            alignment: {horizontal: 'left', vertical: 'middle'},
            font: {
                size: 14
            }
        }

        var logo = workbook.addImage({
            filename: path.join(__dirname,'../../assets/emblema.png'),
            extension: 'png',
        });

        worksheet.addImage(logo, {
            tl: { col: 0.0001, row: 1 },
            ext: { width: 274.56, height: 71.04 }
        })  

    worksheet.columns = [{key: 'A', width: 38}]
    worksheet.mergeCells('B7:J16')
    worksheet.getCell('B7').style = {
      alignment: {wrapText: true, vertical: "top"},
      font: {
        size: 13
      }
    };
    worksheet.getCell('B7').border = {
      top: {style:'double', color: {argb:'00000000'}},
      left: {style:'double', color: {argb:'00000000'}},
      bottom: {style:'double', color: {argb:'00000000'}},
      right: {style:'double', color: {argb:'00000000'}}
    }
    worksheet.getCell('B7').value = 'Este documento corresponde ao relatório mensal de Carga Viral referente ao Mês de Janeiro de 2020. Neste são apresentados , respectivamente: o relatório do (1) Tempo de Resposta, (2) Supressão Viral, (3) Histórico das Amostras e a  (4) Incompletude do preenchimento dos Formulários de Solicitação de Resultados. Em caso de dúvidas, entre em contacto pelos emails: solon.kidane@moz.aphl.org / vagner.ermelindo@moz.aphl.org'

}

}

const thisController = module.exports = new LabReportsController();
