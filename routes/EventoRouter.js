const express = require("express");
const router = express.Router();

const eventoController = require("../controllers/EventoController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", eventoController.get)
  .get("/:id", eventoController.getById)
  .get("/sala/:id", eventoController.getAllBySala)
  .post("/", verifyToken, eventoController.create)
  .put("/:id", verifyToken, eventoController.update)
  .delete("/:id", verifyToken, eventoController._delete);

module.exports = router;
