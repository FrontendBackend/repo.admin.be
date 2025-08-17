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
  const correoExistente = await db.query(
    `SELECT 1 FROM tbl_persona WHERE es_registro = '1' AND de_correo = $1`,
    [dto.deCorreo]
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
      dto.idTipoDocIdentidad,
      dto.idUbigeo,
      dto.flConsorcio,
      dto.coDocumentoIdentidad,
      dto.noRazonSocial,
      dto.noCorto,
      dto.noPersona,
      dto.apPaterno,
      dto.apMaterno,
      dto.tiSexo,
      dto.feNacimiento, // asegurarte que esté en formato 'YYYY-MM-DD'
      dto.deTelefono,
      dto.deTelefono2,
      dto.deCorreo,
      dto.deCorreo2,
      dto.diPersona,
      dto.cmNota,
      dto.deRestriccion,
      dto.noPrefijoPersona,
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

async function modificarPersona(idPersona, dto) {
  const correo = dto.deCorreo.trim().toLowerCase();

  // Obtener el persona actual
  const personaActual = await db.query(
    `SELECT de_correo FROM tbl_persona WHERE id_persona = $1 AND es_registro = '1'`,
    [idPersona]
  );

  if (personaActual.rows.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "No se encontró el persona activo para modificar",
      data: null,
    };
  }

  const correoActual = personaActual.rows[0].de_correo.toLowerCase();

  // Validar solo si el correo fue cambiado
  if (correo !== correoActual) {
    const correoExistente = await db.query(
      `SELECT 1 FROM tbl_persona WHERE de_correo = $1 AND id_persona != $2 AND es_registro = '1'`,
      [correo, idPersona]
    );

    if (correoExistente.rows.length > 0) {
      return {
        tipoResultado: TipoResultado.WARNING,
        mensaje: "El correo ya está registrado por otro persona.",
        data: null,
      };
    }
  }

  // Ejecutar la actualización
  const result = await db.query(
    `
     UPDATE tbl_persona
     SET 
      id_tipo_doc_identidad = $1, 
      id_ubigeo = $2,
      fl_consorcio = $3,
      co_documento_identidad = $4,
      no_razon_social = $5,
      no_corto = $6,
      no_persona = $7,
      ap_paterno = $8,
      ap_materno = $9,
      ti_sexo = $10,
      fe_nacimiento = $11,
      de_telefono = $12,
      de_telefono2 = $13,
      de_correo = $14,
      de_correo2 = $15,
      di_persona = $16,
      cm_nota = $17,
      de_restriccion = $18,
      no_prefijo_persona = $19,
      es_registro = $20,
      us_actualizacion = $21,
      ip_actualizacion = $22,
      fe_actualizacion = $23
     WHERE id_persona = $24 AND es_registro = '1'
     RETURNING *
     `,
    [
      dto.idTipoDocIdentidad,
      dto.idUbigeo,
      dto.flConsorcio,
      dto.coDocumentoIdentidad,
      dto.noRazonSocial,
      dto.noCorto,
      dto.noPersona,
      dto.apPaterno,
      dto.apMaterno,
      dto.tiSexo,
      dto.feNacimiento, // asegurarte que esté en formato 'YYYY-MM-DD'
      dto.deTelefono,
      dto.deTelefono2,
      correo,
      dto.deCorreo2,
      dto.diPersona,
      dto.cmNota,
      dto.deRestriccion,
      dto.noPrefijoPersona,
      "1", // es_registro fijo
      "JVM",
      "127.0.0.1",
      new Date(), // fe_actualizacion
      idPersona,
    ]
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "El persona ha sido modificado correctamente",
    data: new PersonaModel(result.rows[0]),
  };
}

async function obtenerPersonaPorId(idPersona) {
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
     WHERE per.es_registro = '1' AND per.id_persona = $1
     `,
    [idPersona]
  );
  if (result.rows.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "La persona no ha sido encontrado",
      data: null,
    };
  }
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "La persona ha sido encontrado",
    data: new PersonaModel(result.rows[0]),
  };
}

async function eliminarPersona(idPersona) {
  const result = await db.query(
    `UPDATE tbl_persona
     SET es_registro = '0'
     WHERE id_persona = $1 AND es_registro = '1'
     RETURNING *`,
    [idPersona]
  );
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "La persona ha sido eliminado correctamente",
  };
}

module.exports = {
  listarPersona,
  crearPersona,
  modificarPersona,
  obtenerPersonaPorId,
  eliminarPersona,
};
