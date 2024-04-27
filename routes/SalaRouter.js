const express = require("express");
const router = express.Router();

const salaController = require("../controllers/SalaController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", salaController.get)
  .get("/building/:building", salaController.get)
  .get("/:id", salaController.getById)
  .post("/", verifyToken, salaController.create)
  .put("/:id", verifyToken, salaController.update)
  .delete("/:id", verifyToken, salaController._delete);

module.exports = router;
