const express = require("express");
const router = express.Router();
const valorParametroController = require("../controllers/valorParametroController");

router.get("/listarTiposDocumento", valorParametroController.listarTiposDocumento);

module.exports = router;