class ValorParametroDTO {
  constructor(data) {
    this.idValorParametro = data.idValorParametro;
    this.idParametro = data.idParametro;
    this.coClaveTexto = data.coClaveTexto;
    this.coClave = data.coClave;
    this.noValorParametro = data.noValorParametro;
    this.deValorParametro = data.deValorParametro;
    this.nuOrden = data.nuOrden;
    this.deValorAlfanum = data.deValorAlfanum;
    this.nuValorNumerico = data.nuValorNumerico;
    this.flActivo = data.flActivo;
    this.esRegistro = data.esRegistro;
    this.usCreacion = data.usCreacion;
    this.ipCreacion = data.ipCreacion;
    this.feCreacion = data.feCreacion;
    this.usActualizacion = data.usActualizacion;
    this.ipActualizacion = data.ipActualizacion;
    this.feActualizacion = data.feActualizacion;
  }
}
module.exports = ValorParametroDTO;
