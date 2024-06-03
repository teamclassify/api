const express = require("express");
const router = express.Router();

const edificioController = require("../controllers/EdificioController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/", edificioController.get)
  .get("/:id", edificioController.getById)
  .post("/", verifyToken, onlyAdmins, edificioController.create)
  .put("/:id", verifyToken, onlyAdmins, edificioController.update)
  .delete("/:id", verifyToken, onlyAdmins, edificioController._delete);

module.exports = router;
