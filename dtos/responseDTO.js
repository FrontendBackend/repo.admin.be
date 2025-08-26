const { TipoResultado } = require("../exceptions/MyException");
const { obtenerFechaHoraLima } = require("../utils/fechaUtil");

// utils/ResponseDTO.js
class ResponseDTO {
  constructor({ tipoResultado = "SUCCESS", mensaje = "", data = null, lista = null, page = null, id = null, meta = null,status = null }) {
    this.tipoResultado = tipoResultado; // SUCCESS, INFO, ERROR, WARNING
    this.mensaje = mensaje;
    this.data = data;
    this.lista = lista;
    this.page = page;
    this.id = id;
    this.meta = meta;
    this.status = status;
    this.timestamp = obtenerFechaHoraLima();
  }

  static success({ mensaje = "", data = null, lista = null, page = null, id = null, meta = null }) {
    return new ResponseDTO({ tipoResultado: TipoResultado.SUCCESS, mensaje, data, lista, page, id, meta });
  }

  static info({ mensaje = "", data = null, meta = null }) {
    return new ResponseDTO({ tipoResultado: TipoResultado.INFO, mensaje, data, meta });
  }

  static error({ mensaje = "", data = null, meta = null }) {
    return new ResponseDTO({ tipoResultado: TipoResultado.ERROR, mensaje, data, meta });
  }
  
  static warning({ mensaje = "", data = null, meta = null }) {
    return new ResponseDTO({ tipoResultado: TipoResultado.WARNING, mensaje, data, meta });
  }
}

module.exports = ResponseDTO;
