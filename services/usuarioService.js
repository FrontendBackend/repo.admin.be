const db = require("../db/index");

const { MyException, TipoResultado } = require("../exceptions/MyException");
const UsuarioModel = require("../models/UsuarioModel");

async function crearUsuario(dto) {
  // 1. Verificamos si el correo ya existe
  const correoExistente = await db.query(
    `SELECT 1 FROM usuario WHERE es_registro = '1' AND correo_usuario = $1`,
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
  const result = await db.query(
    `INSERT INTO usuario (nombre_usuario, correo_usuario, es_registro)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [dto.nombreUsuario, dto.correoUsuario, "1"]
  );
  
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Usuario creado correctamente",
    data: new UsuarioModel(result.rows[0]),
  };
}

async function modificarUsuario(id, dto) {
  const correo = dto.correoUsuario.trim().toLowerCase();

  // Obtener el usuario actual
  const usuarioActual = await db.query(
    `SELECT correo_usuario FROM usuario WHERE id_usuario = $1 AND es_registro = '1'`,
    [id]
  );

  if (usuarioActual.rows.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "No se encontró el usuario activo para modificar",
      data: null,
    };
  }

  const correoActual = usuarioActual.rows[0].correo_usuario.toLowerCase();

  // Validar solo si el correo fue cambiado
  if (correo !== correoActual) {
    const correoExistente = await db.query(
      `SELECT 1 FROM usuario WHERE correo_usuario = $1 AND id_usuario != $2 AND es_registro = '1'`,
      [correo, id]
    );

    if (correoExistente.rows.length > 0) {
      return {
        tipoResultado: TipoResultado.WARNING,
        mensaje: "El correo ya está registrado por otro usuario.",
        data: null,
      };
    }
  }

  // Ejecutar la actualización
  const result = await db.query(
    `UPDATE usuario
     SET nombre_usuario = $1, correo_usuario = $2
     WHERE id_usuario = $3 AND es_registro = '1'
     RETURNING *`,
    [dto.nombreUsuario, correo, id]
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "El usuario ha sido modificado correctamente",
    data: new UsuarioModel(result.rows[0]),
  };
}



async function listarUsuario() {
  const result = await db.query(
    `SELECT id_usuario, nombre_usuario, correo_usuario
     FROM usuario
     WHERE es_registro = '1'`
  );
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha listado los usuarios correctamente",
    data: result.rows.map((row) => new UsuarioModel(row)),
  };
}

async function obtenerUsuarioPorId(id) {
  const result = await db.query(
    `SELECT id_usuario, nombre_usuario, correo_usuario
     FROM usuario
     WHERE id_usuario = $1 AND es_registro = '1'`,
    [id]
  );
  if (result.rows.length === 0) {
    return {
      tipoResultado: TipoResultado.ERROR,
      mensaje: "El usuario no ha sido encontrado",
      data: null,
    };
  }
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "El usuario ha sido encontrado",
    data: new UsuarioModel(result.rows[0]),
  };
}

async function eliminarUsuario(id) {
  const result = await db.query(
    `UPDATE usuario
     SET es_registro = '0'
     WHERE id_usuario = $1 AND es_registro = '1'
     RETURNING *`,
    [id]
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
