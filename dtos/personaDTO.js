class PersonaDTO {
  constructor(data) {
    this.idPersona = data.idPersona;
    this.idTipoDocIdentidad = data.idTipoDocIdentidad;
    this.idUbigeo = data.idUbigeo;
    this.flConsorcio = data.flConsorcio.trim();
    this.coDocumentoIdentidad = data.coDocumentoIdentidad.trim();
    this.noRazonSocial = data.noRazonSocial.trim();
    this.noCorto = data.noCorto.trim();
    this.noPersona = data.noPersona.trim();
    this.apPaterno = data.apPaterno.trim();
    this.apMaterno = data.apMaterno.trim();
    this.tiSexo = data.tiSexo.trim();
    this.feNacimiento = data.feNacimiento;
    this.deTelefono = data.deTelefono.trim();
    this.deTelefono2 = data.deTelefono2.trim();
    this.deCorreo = data.deCorreo.trim();
    this.deCorreo2 = data.deCorreo2.trim();
    this.diPersona = data.diPersona.trim();
    this.cmNota = data.cmNota.trim();
    this.deRestriccion = data.deRestriccion.trim();
    this.noPrefijoPersona = data.noPrefijoPersona.trim();
    this.esRegistro = data.esRegistro;
    this.usCreacion = data.usCreacion;
    this.ipCreacion = data.ipCreacion;
    this.feCreacion = data.feCreacion;
    this.usActualizacion = data.usActualizacion;
    this.ipActualizacion = data.ipActualizacion;
    this.feActualizacion = data.feActualizacion;
  }

  validate() {
    const errors = [];
    return errors;
  }
}

module.exports = PersonaDTO;
