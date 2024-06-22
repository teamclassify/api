const express = require("express");
const router = express.Router();

const controller = require("../controllers/RetroalimentacionController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", controller.getAll)
  .get("/usuario/", controller.getByUsuario)
  .get("/sala/", controller.getBySala)
  .get("/rol/", controller.getByRol)
  .post("/", controller.create)

module.exports = router;
