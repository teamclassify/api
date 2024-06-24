const express = require("express");
const router = express.Router();

const controller = require("../controllers/RetroalimentacionController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", verifyToken, controller.getAll)
  .get("/:id", verifyToken, controller.getByLoan)
  .get("/usuario/", verifyToken, controller.getByUsuario)
  .get("/sala/", verifyToken, controller.getBySala)
  .get("/rol/", verifyToken, controller.getByRol)
  .post("/", verifyToken, controller.create)

module.exports = router;
