class ParametroModel {
  constructor(row) {
    this.idParametro = row.id_parametro;
    this.coParametro = row.co_parametro;
    this.deParametro = row.de_parametro;
    this.nuOrden = row.nu_orden;
    this.esRegistro = row.es_registro;
    this.usCreacion = row.us_creacion;
    this.ipCreacion = row.ip_creacion;
    this.feCreacion = row.fe_creacion;
    this.usActualizacion = row.us_actualizacion;
    this.ipActualizacion = row.ip_actualizacion;
    this.feActualizacion = row.fe_actualizacion;
  }
}
module.exports = ParametroModel;


