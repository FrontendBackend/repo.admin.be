const express = require("express");
const router = express.Router();
const personaController = require("../controllers/personaController");
const { validateDto } = require("../middlewares/validateDTO");
const PersonaDTO = require("../dtos/personaDTO");

router.get("/listarPersona", personaController.listarPersona);
router.get("/crearPersona", validateDto(PersonaDTO), personaController.crearPersona);

module.exports = router;