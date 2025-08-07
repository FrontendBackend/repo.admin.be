class UbigeoModel {
  constructor(row) {
    this.idUbigeo = row.id_ubigeo;
    this.codigoUbigeo = row.codigo_ubigeo;
    this.departamento = row.departamento;
    this.provincia = row.provincia;
    this.distrito = row.distrito;
  }
}

module.exports = UbigeoModel;