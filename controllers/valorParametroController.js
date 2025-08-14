const ResponseDTO = require("../dtos/responseDTO");
const { TipoResultado } = require("../exceptions/MyException");
const errorHandler = require("../middlewares/errorHandler");
const valorParametroService = require("../services/valorParametro");

async function listarTiposDocumento(req, res) {
  try {
    const resultado = await valorParametroService.listarTiposDocumento();
    if (resultado.tipoResultado === TipoResultado.WARNING.toString()) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data }));
    }
    
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  listarTiposDocumento,
};