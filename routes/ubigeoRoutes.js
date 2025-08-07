const express = require("express");
const router = express.Router();
const ubigeoController = require("../controllers/ubigeoController")

router.get("/listarUbigeo", ubigeoController.listarUbigeo);
router.get("/buscar", ubigeoController.buscarUbigeosPorFiltro); // GET /ubigeos/buscar?filtro=lima

module.exports = router;
