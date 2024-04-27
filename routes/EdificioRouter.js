const express = require("express");
const router = express.Router();

const edificioController = require("../controllers/EdificioController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", edificioController.get)
  .get("/:id", edificioController.getById)
  .post("/", verifyToken, edificioController.create)
  .put("/:id", verifyToken, edificioController.update)
  .delete("/:id", verifyToken, edificioController._delete);

module.exports = router;
