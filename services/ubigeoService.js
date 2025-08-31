const { query } = require("../db");
const { TipoResultado } = require("../exceptions/MyException");
const UbigeoModel = require("../models/ubigeoModel");

/**
 * =========================================================================
 * 1. LISTAR UBIGEO
 * ============================================================================
 * @returns 
 */
async function listarUbigeo() {

  const result = await query(
    `SELECT ubi.id_ubigeo, ubi.departamento, ubi.provincia, ubi.distrito
     FROM tbl_ubigeo ubi`
  );
  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Se ha listado el ubigeo correctamente",
    data: result.map((row) => new UbigeoModel(row)),
  };
}

/**
 * =========================================================================
 * 2. BUSCAR UBIGEO POR FILTRO (asincrónico para autocompletado)
 * =========================================================================
 * @param {string} filtro
 */
async function buscarUbigeosPorFiltro(filtro) {
  if (!filtro || filtro.length < 2) {
    return {
      tipoResultado: TipoResultado.WARNING,
      mensaje: "El filtro debe tener al menos 2 caracteres.",
      data: [],
    };
  }

  const filtroNormalizado = normalizarTexto(filtro);

  const result = await query(
    `SELECT id_ubigeo, codigo_ubigeo, departamento, provincia, distrito
     FROM tbl_ubigeo
    WHERE departamento LIKE ? COLLATE NOCASE
      OR provincia LIKE ? COLLATE NOCASE
      OR distrito LIKE ? COLLATE NOCASE
     ORDER BY departamento, provincia, distrito
     LIMIT 20`,
    [
      `%${filtroNormalizado}%`,
      `%${filtroNormalizado}%`,
      `%${filtroNormalizado}%`,
    ]
  );

  return {
    tipoResultado: TipoResultado.SUCCESS,
    mensaje: "Ubigeos encontrados con éxito",
    data: result.map((row) => new UbigeoModel(row)),
  };
}

function normalizarTexto(texto) {
  return texto
    .normalize("NFD") // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/ñ/gi, "n"); // convierte ñ en
}

module.exports = { listarUbigeo, buscarUbigeosPorFiltro };