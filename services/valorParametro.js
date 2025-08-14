const db = require("../db");
const { TipoResultado } = require("../exceptions/MyException");
const ValorParametroModel = require("../models/valorParametroModel");

async function listarTiposDocumento() {
  const result = await db.query(
    `
        SELECT vpa.id_valor_parametro, vpa.id_parametro, vpa.co_clave_texto, vpa.co_clave, vpa.no_valor_parametro, 
        vpa.de_valor_parametro, vpa.nu_orden, vpa.de_valor_alfanum, vpa.nu_valor_numerico, vpa.fl_activo, vpa.es_registro 
        FROM tbl_valor_parametro vpa
        WHERE vpa.es_registro = '1' AND vpa.id_parametro = '2'
     `
  );
  if (result.rows.length === 0) {
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "No contiene ningún registro de tipos de documentos",
      data: result.rows.map((row) => new ValorParametroModel(row)),
    };
  }

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha listado los tipos de documentos correctamente",
    data: result.rows.map((row) => new ValorParametroModel(row)),
  };
}

module.exports = {
  listarTiposDocumento,
};