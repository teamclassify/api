const express = require("express");
const router = express.Router();

const claseController = require("../controllers/ClaseController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/", claseController.get)
  .get("/:id", claseController.getById)
  .post("/", verifyToken, onlyAdmins, claseController.create)
  .put("/:id", verifyToken, onlyAdmins, claseController.update)
  .delete("/:id", verifyToken, onlyAdmins, claseController._delete);

module.exports = router;
