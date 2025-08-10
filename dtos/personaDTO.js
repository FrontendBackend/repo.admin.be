class PersonaDTO {
  constructor(data) {
    this.idersona = data.idersona;
    this.idTipoDocIdentidad = data.idTipoDocIdentidad;
    this.idUbigeo = data.idUbigeo;
    this.flConsorcio = data.flConsorcio;
    this.coDocumentoIdentidad = data.coDocumentoIdentidad;
    this.noRazoSocial = data.noRazoSocial.trim();
    this.noCorto = data.noCorto.trim();
    this.noPersona = data.noPersona.trim();
    this.apPaterno = data.apPaterno.trim();
    this.apMaterno = data.apMaterno.trim();
    this.tiSexo = data.tiSexo;
    this.feNacimiento = data.feNacimiento;
    this.deTelefono = data.deTelefono;
    this.deTelefono2 = data.deTelefono2;
    this.deCorreo = data.deCorreo.trim();
    this.deCorreo2 = data.deCorreo2.trim();
    this.diPersona = data.diPersona;
    this.cmNota = data.cmNota.trim();
    this.deRestriccion = data.deRestriccion;
    this.noPrefijoPersona = data.noPrefijoPersona;
    this.esRegistro = data.esRegistro;
    this.usCreacion = data.usCreacion;
    this.ipCreacion = data.ipCreacion;
    this.feCreacion = data.feCreacion;
    this.usActualizacion = data.usActualizacion;
    this.ipActualizacion = data.ipActualizacion;
    this.feActualizacion = data.feActualizacion;
  }
}

module.exports = PersonaDTO;
