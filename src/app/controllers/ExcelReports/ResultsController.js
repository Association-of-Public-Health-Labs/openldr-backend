import Excel from 'exceljs'
import sql from 'mssql'
import config from '../../../config/mssql'
import path from 'path'

// Models
import Report from '../../models/Report'

class ResultsController {

    async viralload_results_foreach_facility (facility) {
        const location = facility
        var workbook = new Excel.Workbook()
        var worksheet = workbook.addWorksheet(
            "Relatório 2020", 
            {
                views:[{showGridLines:false}]
            }
        )

        worksheet.columns = [
            {key: 'report', width: 38, style: { }}, 
            {key: 'men', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } } },
            {key: 'women', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'gender_unknown', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'less_than_2', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'between_2_5', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'between_6_14', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'between_15_30', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'greater_than_30', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {key: 'age_unknown', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }}
        ];

        worksheet.getRow(6).values = ['Relatório de CV','Homens','Mulheres','Genêro desconhecido','>2','2-5 anos','6-14 anos','15-30 anos','>30 anos','Idade N/E']


        var header = ['A6','B6','C6','D6','E6','F6','G6','H6','I6','J6']

        thisController.createHeader(worksheet,header)

        var recordset = await Report.report_viralload_indicators(location)
        recordset.map(async (row) => {
            await worksheet.addRow({
                report: row.reportname,
                men: row.male,
                women: row.female,
                gender_unknown: row.gender_unknown,
                less_than_2: row.less_than_2,
                between_2_5: row.between_2_5,
                between_6_14: row.between_6_14, 
                between_15_30: row.between_15_30,
                greater_than_30: row.greater_than_30,
                age_unknown: row.age_unknown
            })
        })

        thisController.createBorders(worksheet)   
        
        thisController.createMOHHeader(workbook,worksheet)




        // Temporary worksheet
        // Add the second worksheet 
        worksheet = workbook.addWorksheet("Resultados 2019", {properties:{font:{name:'Calibri'}}, views: [{state: 'frozen', ySplit:1}]})

        worksheet.columns = [
            {header: 'NID', key: 'nid', width: 20, style: { }}, 
            {header: 'CODIGO DO DISA', key: 'disacode', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } } },
            {header: 'NOME', key: 'name', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'left' } }},
            {header: 'APELIDO', key: 'surname', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'left' } }},
            {header: 'IDADE', key: 'age', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'SEXO', key: 'gender', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'RESULTADO DE CARGA VIRAL', key: 'result', width: 27, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'REGIME DE TRATAMENTO', key: 'regimen', width: 24, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'GRÁVIDA?', key: 'pregnant', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'LACTANTE?', key: 'breastfeeding', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'MOTIVO DE TESTE', key: 'reason', width: 16, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'REJEIÇÃO', key: 'rejected', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE COLHEITA', key: 'specimendate', width: 18, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE REGISTO NO LAB', key: 'registereddate', width: 22, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE ANALISE', key: 'analysisdate', width: 22, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE VALIDAÇÃO', key: 'authoriseddate', width: 22, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
        ];

        header = ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1','N1','O1','P1']

        thisController.createHeader(worksheet,header)

        recordset = await Report.report_viralload_results_temp(location)
        // if(!recordset) return
        recordset.map(async (row) => {
            await worksheet.addRow({
                nid: row.nid, 
                disacode: row.disacode, 
                name: row.name, 
                surname: row.surname, 
                age: row.age, 
                gender: row.gender, 
                result: row.result, 
                regimen: row.regimen, 
                pregnant: row.pregnant,
                breastfeeding: row.breastfeeding,
                reason: row.reason, 
                rejected: row.rejected,
                specimendate: row.specimendate, 
                registereddate: row.registereddate, 
                analysisdate: row.analysisdate, 
                authoriseddate: row.authoriseddate 
            })
        })

        thisController.createBorders(worksheet) 
        // -- Temporary worksheet






        // Add the second worksheet 
        worksheet = workbook.addWorksheet("Resultados 2020", {properties:{font:{name:'Calibri'}}, views: [{state: 'frozen', ySplit:1}]})

        worksheet.columns = [
            {header: 'NID', key: 'nid', width: 20, style: { }}, 
            {header: 'CODIGO DO DISA', key: 'disacode', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } } },
            {header: 'NOME', key: 'name', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'left' } }},
            {header: 'APELIDO', key: 'surname', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'left' } }},
            {header: 'IDADE', key: 'age', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'SEXO', key: 'gender', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'RESULTADO DE CARGA VIRAL', key: 'result', width: 27, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'REGIME DE TRATAMENTO', key: 'regimen', width: 24, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'GRÁVIDA?', key: 'pregnant', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'LACTANTE?', key: 'breastfeeding', width: 20, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'MOTIVO DE TESTE', key: 'reason', width: 16, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'REJEIÇÃO', key: 'rejected', width: 15, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE COLHEITA', key: 'specimendate', width: 18, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE REGISTO NO LAB', key: 'registereddate', width: 22, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE ANALISE', key: 'analysisdate', width: 22, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
            {header: 'DATA DE VALIDAÇÃO', key: 'authoriseddate', width: 22, style: { alignment:{ vertical: 'middle', horizontal: 'center' } }},
        ];

        header = ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1','N1','O1','P1']

        thisController.createHeader(worksheet,header)

        recordset = await Report.report_viralload_results(location)
        // if(!recordset) return
        recordset.map(async (row) => {
            await worksheet.addRow({
                nid: row.nid, 
                disacode: row.disacode, 
                name: row.name, 
                surname: row.surname, 
                age: row.age, 
                gender: row.gender, 
                result: row.result, 
                regimen: row.regimen, 
                pregnant: row.pregnant,
                breastfeeding: row.breastfeeding,
                reason: row.reason, 
                rejected: row.rejected,
                specimendate: row.specimendate, 
                registereddate: row.registereddate, 
                analysisdate: row.analysisdate, 
                authoriseddate: row.authoriseddate 
            })
        })

        thisController.createBorders(worksheet) 

        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                if(!isNaN(cell.value) && colNumber === 7) {
                    if(parseInt(cell.value) > 1000) {
                        row.getCell(colNumber).style = {
                            font: {
                                bold: true,
                                color: {
                                    argb: 'FFFF0000'
                                }
                            },
                            alignment: {horizontal: 'center'}
                        }
                    }
                }

                if(colNumber === 9) {
                    if(row.getCell(colNumber).value === 'Sim'){
                        row.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: {  
                                argb: "FFFF7D7D"
                            },
                            bgColor: {
                                argb: "FF000000"
                            }
                        }
                    }
                }
            })
        })
        
        // await workbook.xlsx.writeFile(path.join(__dirname,'../../reports/'+location+'-' + new Date().toISOString().replace(/:/g, '-') + '.xlsx'))
        await workbook.xlsx.writeFile(path.join(__dirname,'../../reports/'+location+ '.xlsx'))
    }

    async createHeader (worksheet, header) {
        header.forEach(key => {
            worksheet.getCell(key).style = {
                font: {bold: true},
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {  
                        argb: "FFFF7D7D"
                    },
                    bgColor: {
                        argb: "FF000000"
                    }
                }
            }
        })
        worksheet.getRow(1).height = 30
        worksheet.getRow(1).alignment = { vertical: 'middle' };
    }

    async createBorders (worksheet) {
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                // if(cell.value) {
                    row.getCell(colNumber).border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    }
                // }
            })
        })
    }

    async createMOHHeader(workbook,worksheet) {
        // Create a header
        worksheet.mergeCells('A2:A4')
        worksheet.mergeCells('B2:D2')
        worksheet.mergeCells('B3:D3')
        worksheet.mergeCells('B4:D4')
        worksheet.getCell('B2').value = 'Republica de Mocambique'
        worksheet.getCell('B3').value = 'Ministerio da Saude'
        worksheet.getCell('B4').value = 'Relatorio de Resultados de Carga Viral'
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

    }


}

const thisController = module.exports = new ResultsController()