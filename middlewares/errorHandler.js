// middlewares/errorHandler.js
const { MyException } = require("../exceptions/MyException");

function errorHandler(res, err) {
  if (err instanceof MyException) {
    return res.status(501).json({
      tipoResultado: err.tipoResultado,
      mensaje: err.mensaje,
      data: err.data,
    });
  }

  console.error(err);
  return res.status(500).json({
    tipoResultado: "ERROR",
    mensaje: "Error interno del servidor",
  });
}

module.exports = errorHandler;
