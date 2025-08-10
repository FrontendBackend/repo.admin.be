class ValorParametroModel {
  constructor(row) {
    this.idValorParametro = row.id_valor_parametro;
    this.idParametro = row.id_parametro;
    this.coClaveTexto = row.co_clave_texto;
    this.coClave = row.co_clave;
    this.noValorParametro = row.no_valor_parametro;
    this.deValorParametro = row.de_valor_parametro;
    this.nuOrden = row.nu_orden;
    this.deValorAlfanum = row.de_valor_alfanum;
    this.nuValorNumerico = row.nu_valor_numerico;
    this.flActivo = row.fl_activo;
    this.esRegistro = row.es_registro;
    this.usCreacion = row.us_creacion;
    this.ipCreacion = row.ip_creacion;
    this.feCreacion = row.fe_creacion;
    this.usActualizacion = row.us_actualizacion;
    this.ipActualizacion = row.ip_actualizacion;
    this.feActualizacion = row.fe_actualizacion;
  }
}

module.exports = ValorParametroModel;


