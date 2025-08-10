const ResponseDTO = require("../dtos/responseDTO");
const errorHandler = require("../middlewares/errorHandler");

const { TipoResultado } = require("../exceptions/MyException");
const personaService = require("../services/personaService");

async function crearPersona(req, res) {
  try {
    const resultado = await personaService.crearPersona(req.dto);
    if (resultado.tipoResultado === TipoResultado.WARNING.toString()) {
        return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data })); // No se lanza como error
    }
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
      errorHandler(res, error);
  }
}


async function listarPersona(req, res) {
  try {
    const resultado = await personaService.listarPersona();
    if (resultado.tipoResultado === TipoResultado.WARNING.toString()) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data }));
    }
    
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  crearPersona,
  listarPersona
};