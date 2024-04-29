const express = require("express");
const router = express.Router();

const prestamoController = require("../controllers/PrestamoController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", prestamoController.get)
  .get("/:id", prestamoController.getById)
  .post("/", verifyToken, prestamoController.create)
  .put("/:id", verifyToken, prestamoController.update)
  .delete("/:id", verifyToken, prestamoController._delete);

module.exports = router;
