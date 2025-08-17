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

async function modificarPersona(req, res) {
  try {
    const resultado = await personaService.modificarPersona(req.params.idPersona, req.dto);
    if (resultado.tipoResultado === TipoResultado.ERROR.toString()) {
      return res.status(200).json(ResponseDTO.error({ mensaje: resultado.mensaje, data: resultado.data }));
    } else if (resultado.tipoResultado === TipoResultado.WARNING.toString()){
      return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data }));
    } else {
      return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
    }

  } catch (error) {
    errorHandler(res, error);
  }
}

async function obtenerPersonaPorId(req, res) {
  try {
    const resultado = await personaService.obtenerPersonaPorId(req.params.idPersona);
    if (resultado.data === null) {
      return res.status(200).json(ResponseDTO.error({ mensaje: resultado.mensaje, data: resultado.data }));
    }
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

async function eliminarPersona(req, res) {
  try {
    const resultado = await personaService.eliminarPersona(req.params.idPersona);
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje}));
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  crearPersona,
  listarPersona,
  modificarPersona,
  obtenerPersonaPorId,
  eliminarPersona,
};