const express = require("express");
const router = express.Router();

const recursoController = require("../controllers/RecursoController");
const verifyToken = require("../middlewares/verifyToken");
// const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/", recursoController.getAll)
  .get("/:id", recursoController.getById)
  .get("/sala/:id", recursoController.getBySala)
  .post("/", verifyToken, recursoController.create)
  .post("/sala/", verifyToken, recursoController.assignRecurso)
  .put("/:id", verifyToken, recursoController.update)
  .put("/sala/:id", verifyToken, recursoController.updateBySala)
  .delete("/:id", verifyToken, recursoController._delete)
  .delete("/sala/:id", verifyToken, recursoController.unassignRecurso)

module.exports = router;
