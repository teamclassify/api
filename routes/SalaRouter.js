const express = require("express");
const router = express.Router();

const salaController = require("../controllers/SalaController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/", salaController.get)
  .get("/building/:building", salaController.get)
  .get("/disponibles", verifyToken, salaController.getSalasDisponibles)
  .post("/disponibles-rango", verifyToken, salaController.getSalasDisponiblesRango)
  .get("/:id", salaController.getById)
  .post("/", verifyToken, onlyAdmins, salaController.create)
  .put("/:id", verifyToken, onlyAdmins, salaController.update)
  .delete("/:id", verifyToken, onlyAdmins, salaController._delete);

module.exports = router;
