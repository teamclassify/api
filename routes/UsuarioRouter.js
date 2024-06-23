const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/UsuarioController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/", verifyToken, onlyAdmins, usuarioController.get)
  .get("/:id", verifyToken, onlyAdmins, usuarioController.getById)
  .put("/me", verifyToken, usuarioController.updateMe)
  .put("/:id", verifyToken, onlyAdmins, usuarioController.update)
  .post("/rols", verifyToken, onlyAdmins, usuarioController.setRols);

module.exports = router;

