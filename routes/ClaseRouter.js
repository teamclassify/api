const express = require("express");
const router = express.Router();

const claseController = require("../controllers/ClaseController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", claseController.get)
  .get("/:id", claseController.getById)
  .post("/", verifyToken, claseController.create)
  .put("/:id", verifyToken, claseController.update)
  .delete("/:id", verifyToken, claseController._delete);

module.exports = router;
