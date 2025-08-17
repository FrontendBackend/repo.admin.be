class PersonaModel {
  constructor(row) {
    this.idPersona = row.id_persona;
    this.idTipoDocIdentidad = row.id_tipo_doc_identidad;
    this.idUbigeo = row.id_ubigeo;
    this.flConsorcio = row.fl_consorcio;
    this.coDocumentoIdentidad = row.co_documento_identidad.trim();
    this.noRazonSocial = row.no_razon_social;
    this.noCorto = row.no_corto;
    this.noPersona = row.no_persona;
    this.apPaterno = row.ap_paterno;
    this.apMaterno = row.ap_materno;
    this.tiSexo = row.ti_sexo;
    this.feNacimiento = row.fe_nacimiento;
    this.deTelefono = row.de_telefono;
    this.deTelefono2 = row.de_telefono2;
    this.deCorreo = row.de_correo;
    this.deCorreo2 = row.de_correo2;
    this.diPersona = row.di_persona;
    this.cmNota = row.cm_nota;
    this.deRestriccion = row.de_restriccion;
    this.noPrefijoPersona = row.no_prefijo_persona;
    this.esRegistro = row.es_registro;
    this.usCreacion = row.us_creacion;
    this.ipCreacion = row.ip_creacion;
    this.feCreacion = row.fe_creacion;
    this.usActualizacion = row.us_actualizacion;
    this.ipActualizacion = row.ip_actualizacion;
    this.feActualizacion = row.fe_actualizacion;
    this.descNoDocumentoIdentidad = row.no_valor_parametro;
    this.descNombreUbigeo = row.nombre_ubigeo;
  }
}

module.exports = PersonaModel;
