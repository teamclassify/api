const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/UsuarioController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", verifyToken, usuarioController.get)
  .get("/:id", verifyToken, usuarioController.getById);

module.exports = router;

