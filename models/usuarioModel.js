class UsuarioModel {
  constructor(row) {
    this.idUsuario = row.id_usuario;
    this.nombreUsuario = row.nombre_usuario;
    this.correoUsuario = row.correo_usuario;
    // Puedes incluir este campo si deseas enviarlo al frontend
    // this.esRegistro = row.es_registro;
  }
}

module.exports = UsuarioModel;
