// dto/PersonaPaginadorDTO.js
class PersonaPaginadorDTO {
  constructor(query, body) {
    this.page = parseInt(query.page) || 1;
    this.limit = parseInt(query.limit) || 10;
    this.sort = query.sort || "";
    this.nombreCompleto = body.nombreCompleto || "";
    this.idTipoDocIdentidad = body.idTipoDocIdentidad || "";
  }
}

module.exports = PersonaPaginadorDTO;
