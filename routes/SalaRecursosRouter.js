const express = require("express");
const router = express.Router();

const salaRecursosController = require("../controllers/SalaRecursosController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/", salaRecursosController.get)
  .get("/:id", salaRecursosController.getById)
  .post("/", verifyToken, onlyAdmins, salaRecursosController.create)
  .put("/:id", verifyToken, onlyAdmins, salaRecursosController.update)
  .delete("/:id", verifyToken, onlyAdmins, salaRecursosController._delete);

module.exports = router;
