
const { query } = require("../db");
const { MyException, TipoResultado } = require("../exceptions/MyException");
const UsuarioModel = require("../models/usuarioModel");

async function crearUsuario(dto) {
  // 1. Verificamos si el correo ya existe
  const correoExistente = await query(
    `SELECT 1 FROM tbl_usuario WHERE es_registro = '1' AND correo_usuario = ?`,
    [dto.correoUsuario]
  );

  if (correoExistente.rowCount > 0) {
    // 2. Lanzamos excepción personalizada
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "El correo que quiere registrar ya existe",
      data: null,
    };
  }

  // Forzamos es_registro a '1' al crear
  const result = await query(
    `INSERT INTO tbl_usuario (nombre_usuario, correo_usuario, es_registro, id_ubigeo, fe_nacimiento)
     VALUES (?, ?, ?, ?, ?)
     RETURNING *`,
    [dto.nombreUsuario, dto.correoUsuario, "1", dto.idUbigeo, dto.feNacimiento]
  );
  
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Usuario creado correctamente",
    data: new UsuarioModel(result[0]),
  };
}

async function modificarUsuario(idUsuario, dto) {
  const correo = dto.correoUsuario.trim().toLowerCase();

  // Obtener el usuario actual
  const usuarioActual = await query(
    `SELECT correo_usuario FROM tbl_usuario WHERE id_usuario = ? AND es_registro = '1'`,
    [idUsuario]
  );

  if (usuarioActual.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "No se encontró el usuario activo para modificar",
      data: null,
    };
  }

  const correoActual = usuarioActual[0].correo_usuario.toLowerCase();

  // Validar solo si el correo fue cambiado
  if (correo !== correoActual) {
    const correoExistente = await query(
      `SELECT 1 FROM tbl_usuario WHERE correo_usuario = ? AND id_usuario != ? AND es_registro = '1'`,
      [correo, idUsuario]
    );

    if (correoExistente.length > 0) {
      return {
        tipoResultado: TipoResultado.WARNING,
        mensaje: "El correo ya está registrado por otro usuario.",
        data: null,
      };
    }
  }

  // Ejecutar la actualización
  const result = await query(
    `UPDATE tbl_usuario
     SET nombre_usuario = ?, correo_usuario = ?, id_ubigeo = ?, fe_nacimiento = ?
     WHERE id_usuario = ? AND es_registro = '1'
     RETURNING *`,
    [dto.nombreUsuario, correo, dto.idUbigeo, idUsuario, dto.feNacimiento]
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "El usuario ha sido modificado correctamente",
    data: new UsuarioModel(result[0]),
  };
}

async function listarUsuario() {
  const result = await query(
    `SELECT usu.id_usuario, usu.nombre_usuario, usu.correo_usuario, usu.id_ubigeo, 
     (ubi.departamento || ', ' || ubi.provincia || ', ' || ubi.distrito) AS nombre_ubigeo, usu.fe_nacimiento
     FROM tbl_usuario usu
     inner join tbl_ubigeo ubi on (ubi.id_ubigeo = usu.id_ubigeo)
     WHERE usu.es_registro = '1'`
  );
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha listado los usuarios correctamente",
    data: result.map((row) => new UsuarioModel(row)),
  };
}

async function obtenerUsuarioPorId(idUsuario) {
  const result = await query(
    `SELECT usu.id_usuario, usu.nombre_usuario, usu.correo_usuario, usu.id_ubigeo, 
     (ubi.departamento || ', ' || ubi.provincia || ', ' || ubi.distrito) AS nombre_ubigeo, usu.fe_nacimiento
     FROM tbl_usuario usu
     inner join tbl_ubigeo ubi on (ubi.id_ubigeo = usu.id_ubigeo)
     WHERE usu.id_usuario = ? AND usu.es_registro = '1'`,
    [idUsuario]
  );
  if (result.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "El usuario no ha sido encontrado",
      data: null,
    };
  }
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "El usuario ha sido encontrado",
    data: new UsuarioModel(result[0]),
  };
}

async function eliminarUsuario(idUsuario) {
  const result = await query(
    `UPDATE tbl_usuario
     SET es_registro = '0'
     WHERE id_usuario = ? AND es_registro = '1'
     RETURNING *`,
    [idUsuario]
  );
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "El usuario ha sido eliminado correctamente",
  };
}

module.exports = {
  listarUsuario,
  obtenerUsuarioPorId,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
};
