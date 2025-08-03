const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarioController");
const { validateDto } = require("../middlewares/validateDTO");
const { CrearUsuarioDTO, ModificarUsuarioDTO } = require("../dtos/usuarioDTO");

router.get("/listarUsuarios", controller.listarUsuario);
router.get("/obtenerUsuarioPorId/:idUsuario", controller.obtenerUsuarioPorId);
router.post("/crearUsuario", validateDto(CrearUsuarioDTO), controller.crearUsuario);
router.put("/modificarUsuario/:idUsuario", validateDto(ModificarUsuarioDTO), controller.modificarUsuario);
router.delete("/eliminarUsuario/:idUsuario", controller.eliminarUsuario);

module.exports = router;
