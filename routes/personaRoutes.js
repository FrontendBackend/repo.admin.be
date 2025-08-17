const express = require("express");
const router = express.Router();
const personaController = require("../controllers/personaController");
const { validateDto } = require("../middlewares/validateDTO");
const PersonaDTO = require("../dtos/personaDTO");

router.get("/listarPersona", personaController.listarPersona);
router.post("/crearPersona", validateDto(PersonaDTO), personaController.crearPersona);
router.get("/obtenerPersonaPorId/:idPersona", personaController.obtenerPersonaPorId);
router.put("/modificarPersona/:idPersona", validateDto(PersonaDTO), personaController.modificarPersona);
router.delete("/eliminarPersona/:idPersona", personaController.eliminarPersona);

module.exports = router;