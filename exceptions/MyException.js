// src/exceptions/MyException.js
class MyException extends Error {
  constructor({ tipoResultado = TipoResultado.NONE, mensaje = "Error inesperado", data = null }) {
    super(mensaje); // ✅ Este es el mensaje que luego verá el sistema de errores
    this.name = "MyException";
    this.tipoResultado = tipoResultado;
    this.data = data;
  }
}

// Simulación del Enum TipoResultado
const TipoResultado = {
  NONE: "NONE",
  INFO: "INFO",
  ERROR: "ERROR",
  WARNING: "WARNING",
  SUCCESS: "SUCCESS",
};

module.exports = { MyException, TipoResultado };
