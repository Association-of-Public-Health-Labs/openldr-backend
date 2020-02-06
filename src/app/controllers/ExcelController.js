class ExcelController {
  async createHeader(worksheet, header, style) {
    header.forEach(key => {
      worksheet.getCell(key).style = style;
    });
    worksheet.getRow(1).height = 30;
    worksheet.getRow(1).alignment = { vertical: "middle" };
  }

  async createBorders(worksheet, borderStyle) {
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        // if(cell.value) {
        row.getCell(colNumber).border = borderStyle;
        // }
      });
    });
  }

  async createMOHHeader(workbook, worksheet) {
    // Create a header
    worksheet.mergeCells("A2:A4");
    worksheet.mergeCells("B2:D2");
    worksheet.mergeCells("B3:D3");
    worksheet.mergeCells("B4:D4");
    worksheet.getCell("B2").value = "Republica de Mocambique";
    worksheet.getCell("B3").value = "Ministerio da Saude";
    worksheet.getCell("B4").value = "Relatorio de Resultados de Carga Viral";
    worksheet.getCell("B2").style = {
      alignment: { horizontal: "left", vertical: "middle" },
      font: {
        bold: true,
        size: 14
      }
    };
    worksheet.getCell("B3").style = {
      alignment: { horizontal: "left", vertical: "middle" },
      font: {
        size: 14
      }
    };
    worksheet.getCell("B4").style = {
      alignment: { horizontal: "left", vertical: "middle" },
      font: {
        size: 14
      }
    };

    var logo = workbook.addImage({
      filename: path.join(__dirname, "../../assets/emblema.png"),
      extension: "png"
    });

    worksheet.addImage(logo, {
      tl: { col: 0.0001, row: 1 },
      ext: { width: 274.56, height: 71.04 }
    });
  }

  async headerAlignment(worksheet, header) {
    header.map((item) => {
      worksheet.getCell(item).alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "center"
      };
    })
  }
}

const excel = module.exports = new ExcelController();
