const ResponseDTO = require("../dtos/responseDTO");
const errorHandler = require("../middlewares/errorHandler");

const { TipoResultado } = require("../exceptions/MyException");
const personaService = require("../services/personaService");
const PersonaPaginadorDTO = require("../dtos/personaPaginadorDTO");

async function crearPersona(req, res) {
  try {
    const resultado = await personaService.crearPersona(req.dto);
    if (resultado.tipoResultado === TipoResultado.WARNING.toString()) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data })); // No se lanza como error
    }
    const resultadoPersonaCreado = await personaService.obtenerPersonaPorId(resultado.data.idPersona);
     if (resultadoPersonaCreado.data === null) {
      return res.status(200).json(ResponseDTO.error({ mensaje: resultadoPersonaCreado.mensaje, data: resultadoPersonaCreado.data }));
    }
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultadoPersonaCreado.data }));
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

async function paginarPersona(req, res) {
  try {

    const dto = new PersonaPaginadorDTO(req.query, req.body);

    const result = await personaService.paginarPersona(dto);

    return res.json(ResponseDTO.success({ mensaje: result.mensaje, data: result.data }));
    
  } catch (error) {
    console.error("Error en listarPersona:", error); // 👈 imprime el error real en consola
    return res.status(500).json(
      ResponseDTO.error({
        mensaje: error.message || "Error interno del servidor",
      })
    );
    
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
     const resultadoPersonaModificado = await personaService.obtenerPersonaPorId(resultado.data.idPersona);
     if (resultadoPersonaModificado.data === null) {
      return res.status(200).json(ResponseDTO.error({ mensaje: resultadoPersonaModificado.mensaje, data: resultadoPersonaModificado.data }));
     }
      return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultadoPersonaModificado.data }));
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
  paginarPersona,
  modificarPersona,
  obtenerPersonaPorId,
  eliminarPersona,
};