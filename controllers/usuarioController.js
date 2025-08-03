const userService = require("../services/usuarioService");
const { TipoResultado, MyException } = require("../exceptions/MyException");
const ResponseDTO = require("../dtos/responseDTO");
const errorHandler = require("../middlewares/errorHandler");

async function crearUsuario(req, res) {
  try {
    const resultado = await userService.crearUsuario(req.dto);

    if (resultado.tipoResultado === TipoResultado.WARNING.toString()) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data })); // No se lanza como error
    }

    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

async function modificarUsuario(req, res) {
  try {
    const resultado = await userService.modificarUsuario(req.params.idUsuario, req.dto);
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

async function listarUsuario(req, res) {
  try {
    const resultado = await userService.listarUsuario();
    if (resultado.data.length === 0) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: "No contiene ningún registro de usuarios", data: resultado.data }));
    }
    
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

async function obtenerUsuarioPorId(req, res) {
  try {
    const resultado = await userService.obtenerUsuarioPorId(req.params.idUsuario);
    if (resultado.data === null) {
      return res.status(200).json(ResponseDTO.error({ mensaje: resultado.mensaje, data: resultado.data }));
    }
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

async function eliminarUsuario(req, res) {
  try {
    const resultado = await userService.eliminarUsuario(req.params.idUsuario);
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje}));
  } catch (error) {
    errorHandler(res, error);
  }
}


function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  res
    .status(statusCode)
    .json(
      ResponseDTO.error({
        mensaje: error.message || "Error interno del servidor",
      })
    );
}
module.exports = {
  crearUsuario,
  modificarUsuario,
  listarUsuario,
  obtenerUsuarioPorId,
  eliminarUsuario,
};

