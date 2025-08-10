class ParametroDTO {
  constructor(data) {
    this.idParametro = data.idParametro;
    this.coParametro = data.coParametro;
    this.deParametro = data.deParametro;
    this.nuOrden = data.nuOrden;
    this.esRegistro = data.esRegistro;
    this.usCreacion = data.usCreacion;
    this.ipCreacion = data.ipCreacion;
    this.feCreacion = data.feCreacion;
    this.usActualizacion = data.usActualizacion;
    this.ipActualizacion = data.ipActualizacion;
    this.feActualizacion = data.feActualizacion;
  }
}
module.exports = ParametroDTO;
