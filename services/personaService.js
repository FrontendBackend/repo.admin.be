// const db = require("../db");
const { query } = require("../db");
const { TipoResultado } = require("../exceptions/MyException");
const PersonaModel = require("../models/personaModel");

async function listarPersona() {
  const result = await query(
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

async function paginarPersona(paginadorDTO) {
  const { page, limit, nombreCompleto, idTipoDocIdentidad, sort } =
    paginadorDTO;
  const offset = (page - 1) * limit;

  // Construimos condiciones dinámicas
  let conditions = `WHERE per.es_registro = '1'`;
  const params = [];

  if (nombreCompleto && nombreCompleto.trim() !== "") {
    params.push(`%${nombreCompleto.trim()}%`);
    conditions += ` AND ( (IFNULL(per.no_persona,'') || ' ' || IFNULL(per.ap_paterno,'') || ' ' || IFNULL(per.ap_materno,'')) LIKE ? COLLATE NOCASE )`;
  }

  if (idTipoDocIdentidad && idTipoDocIdentidad !== "") {
    params.push(idTipoDocIdentidad);
    conditions += ` AND per.id_tipo_doc_identidad = ?`;
  }

  // --- Consulta para el total ---
  const countResult = await query(
    `
      SELECT COUNT(*) as total
      FROM tbl_persona per
      ${conditions}
    `,
    params
  );

  const total = parseInt(countResult[0].total, 10);

  // --- Consulta con paginación ---
  params.push(limit);
  params.push(offset);

  const result = await query(
    `
      SELECT per.id_persona, per.id_tipo_doc_identidad, per.id_ubigeo, per.fl_consorcio, per.co_documento_identidad, 
             per.no_razon_social, per.no_corto, per.no_persona, per.ap_paterno, per.ap_materno, per.ti_sexo, per.fe_nacimiento, 
             per.de_telefono, per.de_telefono2, per.de_correo, per.de_correo2, per.di_persona, per.cm_nota, per.de_restriccion, 
             per.no_prefijo_persona, per.es_registro, vap.no_valor_parametro, 
             (ubi.departamento || ', ' || ubi.provincia || ', ' || ubi.distrito) AS nombre_ubigeo
      FROM tbl_persona per
      INNER JOIN tbl_ubigeo ubi on (ubi.id_ubigeo = per.id_ubigeo)
      INNER JOIN tbl_valor_parametro vap on (vap.id_valor_parametro = per.id_tipo_doc_identidad)
      ${conditions}
      ORDER BY ${sort}
      LIMIT ? OFFSET ?
    `,
    params
  );

  if (result.length === 0) {
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "No contiene ningún registro de personas",
      data: {
        data: [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha listado y paginado las personas correctamente",
    data: {
      data: result.map((row) => new PersonaModel(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function crearPersona(dto) {
  // Validar correo existente
  const correoExistente = await query(
    `SELECT 1 FROM tbl_persona WHERE es_registro = '1' AND de_correo = ?`,
    [dto.deCorreo]
  );

  if (correoExistente.length > 0) {
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "El correo que quiere registrar ya existe",
      data: null,
    };
  }

  // Insertar persona
  const result = await query(
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
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
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
      dto.feNacimiento, // asegurarte que sea string 'YYYY-MM-DD'
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
      new Date().toISOString(), // fe_creacion en ISO
    ]
  );

  // Recuperar el registro recién creado
  const nuevaPersona = await query(
    `SELECT * FROM tbl_persona WHERE id_persona = last_insert_rowid()`
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha creado la persona correctamente",
    data: new PersonaModel(nuevaPersona[0]),
  };
}

async function modificarPersona(idPersona, dto) {
  const correo = dto.deCorreo.trim().toLowerCase();

  // Obtener el persona actual
  const personaActual = await query(
    `SELECT de_correo FROM tbl_persona WHERE id_persona = ? AND es_registro = '1'`,
    [idPersona]
  );

  if (personaActual.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "No se encontró la persona activa para modificar",
      data: null,
    };
  }

  const correoActual = personaActual[0].de_correo.toLowerCase();

  // Validar solo si el correo fue cambiado
  if (correo !== correoActual) {
    const correoExistente = await query(
      `SELECT 1 FROM tbl_persona WHERE de_correo = ? AND id_persona != ? AND es_registro = '1'`,
      [correo, idPersona]
    );

    if (correoExistente.length > 0) {
      return {
        tipoResultado: TipoResultado.WARNING,
        mensaje: "El correo ya está registrado por otra persona.",
        data: null,
      };
    }
  }

  // Ejecutar la actualización
  await query(
    `
     UPDATE tbl_persona
     SET 
      id_tipo_doc_identidad = ?, 
      id_ubigeo = ?,
      fl_consorcio = ?,
      co_documento_identidad = ?,
      no_razon_social = ?,
      no_corto = ?,
      no_persona = ?,
      ap_paterno = ?,
      ap_materno = ?,
      ti_sexo = ?,
      fe_nacimiento = ?,
      de_telefono = ?,
      de_telefono2 = ?,
      de_correo = ?,
      de_correo2 = ?,
      di_persona = ?,
      cm_nota = ?,
      de_restriccion = ?,
      no_prefijo_persona = ?,
      es_registro = ?,
      us_actualizacion = ?,
      ip_actualizacion = ?,
      fe_actualizacion = ?
     WHERE id_persona = ? AND es_registro = '1'
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
      dto.feNacimiento,
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
      new Date().toISOString(),
      idPersona,
    ]
  );

  // 🔹 Recuperar el registro actualizado
  const actualizado = await query(
    `SELECT * FROM tbl_persona WHERE id_persona = ? AND es_registro = '1'`,
    [idPersona]
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "La persona ha sido modificada correctamente",
    data: actualizado.length > 0 ? new PersonaModel(actualizado[0]) : null,
  };
}


async function obtenerPersonaPorId(idPersona) {
  const result = await query(
    `
     SELECT per.id_persona, per.id_tipo_doc_identidad, per.id_ubigeo, per.fl_consorcio, per.co_documento_identidad, 
     per.no_razon_social, per.no_corto, per.no_persona, per.ap_paterno, per.ap_materno, per.ti_sexo, per.fe_nacimiento, 
     per.de_telefono, per.de_telefono2, per.de_correo, per.de_correo2, per.di_persona, per.cm_nota, per.de_restriccion, 
     per.no_prefijo_persona, per.es_registro, vap.no_valor_parametro, 
     (ubi.departamento || ', ' || ubi.provincia || ', ' || ubi.distrito) AS nombre_ubigeo
     FROM tbl_persona per
     INNER JOIN tbl_ubigeo ubi on (ubi.id_ubigeo = per.id_ubigeo)
     INNER JOIN tbl_valor_parametro vap on (vap.id_valor_parametro = per.id_tipo_doc_identidad)
     WHERE per.es_registro = '1' AND per.id_persona = ?
     `,
    [idPersona]
  );
  if (result.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "La persona no ha sido encontrado",
      data: null,
    };
  }
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "La persona ha sido encontrado",
    data: new PersonaModel(result[0]),
  };
}

async function eliminarPersona(idPersona) {
  const result = await query(
    `UPDATE tbl_persona
     SET es_registro = '0'
     WHERE id_persona = ? AND es_registro = '1'
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
  paginarPersona,
  crearPersona,
  modificarPersona,
  obtenerPersonaPorId,
  eliminarPersona,
};
