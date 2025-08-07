class UsuarioModel {
  constructor(row) {
    this.idUsuario = row.id_usuario;
    this.nombreUsuario = row.nombre_usuario;
    this.correoUsuario = row.correo_usuario;
    this.idUbigeo = row.id_ubigeo;
    this.nombreUbigeo = row.nombre_ubigeo;
    this.feNacimiento = row.fe_nacimiento;
    // Puedes incluir este campo si deseas enviarlo al frontend
    // this.esRegistro = row.es_registro;
  }
}

module.exports = UsuarioModel;
