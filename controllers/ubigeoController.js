const ResponseDTO = require("../dtos/responseDTO");
const { TipoResultado } = require("../exceptions/MyException");
const errorHandler = require("../middlewares/errorHandler");
const ubigeoService = require("../services/ubigeoService");

async function listarUbigeo(req, res) {
  try {
    const resultado = await ubigeoService.listarUbigeo();
    if (resultado.data.length === 0) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: "No contiene ningún registro de ubigeo", data: resultado.data }));
    }
    
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

async function buscarUbigeosPorFiltro(req, res) {

  const filtro = req.query.filtro;
  
  try {
    const resultado = await ubigeoService.buscarUbigeosPorFiltro(filtro);
    if (resultado.tipoResultado === TipoResultado.WARNING.toString()) {
      return res.status(200).json(ResponseDTO.warning({ mensaje: resultado.mensaje, data: resultado.data }));
    }
    
    return res.status(200).json(ResponseDTO.success({ mensaje: resultado.mensaje, data: resultado.data }));
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  listarUbigeo,
  buscarUbigeosPorFiltro,
};