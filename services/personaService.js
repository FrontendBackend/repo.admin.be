const db = require("../db");
const { TipoResultado } = require("../exceptions/MyException");
const PersonaModel = require("../models/personaModel");

async function listarPersona() {
  const result = await db.query(
    `
        SELECT per.id_persona, per.id_tipo_doc_identidad, per.id_ubigeo, per.fl_consorcio, per.co_documento_identidad, 
        per.no_razon_social, per.no_corto, per.no_persona, per.ap_paterno, per.ap_materno, per.ti_sexo, per.fe_nacimiento, 
        per.de_telefono, per.de_telefono2, per.de_correo, per.de_correo2, per.di_persona, per.cm_nota, per.de_restriccion, 
        per.no_prefijo_persona, per.es_registro, vap.no_valor_parametro, 
        (ubi.departamento || ', ' || ubi.provincia || ', ' || ubi.distrito) AS nombre_ubigeo
        FROM tbl_persona per
        INNER JOIN tbl_ubigeo ubi on (ubi.id_ubigeo = per.id_ubigeo)
        INNER JOIN tbl_valor_parametro vap on (vap.id_valor_parametro = per.id_tipo_doc_identidad)
        WHERE per.es_registro = '1'
     `
  );
  if (result.rows.length === 0) {
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "No contiene ningún registro de personas",
      data: result.rows.map((row) => new PersonaModel(row)),
    };
  }

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha listado las personas correctamente",
    data: result.rows.map((row) => new PersonaModel(row)),
  };
}

async function crearPersona(dto) {
  const personaModel = new PersonaModel(dto);

  const correoExistente = await db.query(
    `SELECT 1 FROM tbl_persona WHERE es_registro = '1' AND de_correo = $1`,
    [personaModel.deCorreo]
  );

  if (correoExistente.rowCount > 0) {
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "El correo que quiere registrar ya existe",
      data: null,
    };
  }

  const result = await db.query(
    `
    INSERT INTO tbl_persona (
      id_tipo_doc_identidad, 
      id_ubigeo,
      fl_consorcio,
      co_documento_identidad,
      no_razon_social,
      no_corto,
      no_persona,
      ap_paterno,
      ap_materno,
      ti_sexo,
      fe_nacimiento,
      de_telefono,
      de_telefono2,
      de_correo,
      de_correo2,
      di_persona,
      cm_nota,
      de_restriccion,
      no_prefijo_persona,
      es_registro,
      us_creacion,
      ip_creacion,
      fe_creacion
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
      $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
    )
    RETURNING *
    `,
    [
      personaModel.idTipoDocIdentidad,
      personaModel.idUbigeo,
      personaModel.flConsorcio,
      personaModel.coDocumentoIdentidad,
      personaModel.noRazonSocial,
      personaModel.noCorto,
      personaModel.noPersona,
      personaModel.apPaterno,
      personaModel.apMaterno,
      personaModel.tiSexo,
      personaModel.feNacimiento, // asegurarte que esté en formato 'YYYY-MM-DD'
      personaModel.deTelefono,
      personaModel.deTelefono2,
      personaModel.deCorreo,
      personaModel.deCorreo2,
      personaModel.diPersona,
      personaModel.cmNota,
      personaModel.deRestriccion,
      personaModel.noPrefijoPersona,
      "1", // es_registro fijo
      "JVM",
      "127.0.0.1",
      new Date(), // fe_creacion
    ]
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha creado la persona correctamente",
    data: new PersonaModel(result.rows[0]),
  };
}

module.exports = {
  listarPersona,
  crearPersona,
};