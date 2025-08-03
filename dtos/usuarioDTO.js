class CrearUsuarioDTO {
  constructor(data) {
    this.nombreUsuario = data.nombreUsuario?.trim();
    this.correoUsuario = data.correoUsuario?.trim();
  }

  validate() {
    const errors = [];
    if (!this.nombreUsuario || this.nombreUsuario.length < 2) errors.push("Nombre inválido");
    if (!this.correoUsuario || !this.correoUsuario.includes("@")) errors.push("Email inválido");
    return errors;
  }
}

class ModificarUsuarioDTO {
  constructor(data) {
    this.nombreUsuario = data.nombreUsuario?.trim();
    this.correoUsuario = data.correoUsuario?.trim();
  }

  validate() {
    const errors = [];
    if (this.nombreUsuario && this.nombreUsuario.length < 2) errors.push("Nombre inválido");
    if (this.correoUsuario && !this.correoUsuario.includes("@")) errors.push("Email inválido");
    return errors;
  }
}

module.exports = {
  CrearUsuarioDTO,
  ModificarUsuarioDTO,
};
