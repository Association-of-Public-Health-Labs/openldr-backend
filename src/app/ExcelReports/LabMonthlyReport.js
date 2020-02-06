export const tatWorksheet = {
    columns: [
      { header: "Tipo de Amostra", key: "NAME", width: 15, style: {} },
      {
        header: "Colheita à Recepção",
        key: "COLLECTION_TO_RECEIVE",
        width: 18,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Recepção ao Registo",
        key: "RECEIVE_TO_REGISTER",
        width: 18,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Registo à Análise",
        key: "REGISTER_TO_ANALYSIS",
        width: 18,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Análise à Validação",
        key: "ANALYSIS_TO_AUTHORISE",
        width: 18,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Total",
        key: "TOTAL",
        width: 15,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      }
    ],
    header: ["A1", "B1", "C1", "D1", "E1", "F1"],
    headerStyle: {
      font: { bold: true },
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
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    }
  };
  
  export const viralLoadWorksheet = {
    columns: [
      {
        header: "Categoria",
        key: "CATEGORY",
        width: 12,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Indicador",
        key: "INDICATOR",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Total",
        key: "TOTAL",
        width: 10,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "CV < 1000 cp/ml",
        key: "SUPPRESSED",
        width: 15,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "CV > 1000 cp/ml",
        key: "NOT_SUPPRESSED",
        width: 15,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Rotina (<1000cp/ml)",
        key: "ROUTINE_SUP",
        width: 18,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Rotina (>1000cp/ml)",
        key: "ROUTINE_NOT_SUP",
        width: 18,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Falência Terapeutica (<1000cp/ml)",
        key: "STF_SUP",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Falência Terapeutica (>1000cp/ml)",
        key: "STF_NOT_SUP",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Repetir apos Aleitamento (<1000cp/ml)",
        key: "RAB_SUP",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Repetir apos Aleitamento (>1000cp/ml)",
        key: "RAB_NOT_SUP",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Motivo não especificado (<1000cp/ml)",
        key: "RNS_SUP",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Motivo não especificado (>1000cp/ml)",
        key: "RNS_NOT_SUP",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      }
    ],
    header: [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1",
      "M1"
    ],
    headerStyle: {
      font: { bold: true },
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
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    },
  };
 
  
export const samplesWorksheet = {
    columns: [
      {
        header: "Provincia",
        key: "PROVINCE",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "Distrito",
        key: "DISTRICT",
        width: 25,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "Unidade Sanitaria",
        key: "FACILITY",
        width: 26,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "No. Amostras Registadas",
        key: "REGISTERED",
        width: 12,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "# DBS",
        key: "DBS",
        width: 12,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "# Plasma",
        key: "PLASMA",
        width: 12,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "No. Amostras Testadas",
        key: "TESTED",
        width: 12,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "No. Amostras Rejeitadas",
        key: "REJECTED",
        width: 12,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      }
    ],
    header: ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"],
    headerStyle: {
      font: { bold: true },
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
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    }
  };
  
  export const incompletenessWorksheet = {
    columns: [
      {
        header: "Provincia",
        key: "PROVINCE",
        width: 16,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "Distrito",
        key: "DISTRICT",
        width: 25,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "Unidade Sanitaria",
        key: "FACILITY",
        width: 25,
        style: { alignment: { vertical: "middle", horizontal: "left" } }
      },
      {
        header: "Total de Amostras Registadas",
        key: "REGISTERED",
        width: 14,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras Sem NID preenchido",
        key: "NID",
        width: 14,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem data de colheita",
        key: "SPECIMEN_DATE",
        width: 15,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem Sexo especificado",
        key: "GENDER",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem Regime de Tratamento",
        key: "REGIMEN",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem Motivo de Teste",
        key: "REASON_FOR_TEST",
        width: 15,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem Gravidês especificada",
        key: "PREGNANT",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem Lactância especificada",
        key: "BREASTFEEDING",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      },
      {
        header: "Amostras sem Linha de Tratamento",
        key: "TREATMENT_LINE",
        width: 20,
        style: { alignment: { vertical: "middle", horizontal: "center" } }
      }
    ],
    header: [
      "A1",
      "B1",
      "C1",
      "D1",
      "E1",
      "F1",
      "G1",
      "H1",
      "I1",
      "J1",
      "K1",
      "L1"
    ],
    headerStyle: {
      font: { bold: true },
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
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    }
  };

  