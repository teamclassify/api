const express = require("express");
const router = express.Router();

const recursoController = require("../controllers/RecursoController");
const verifyToken = require("../middlewares/verifyToken");

router
  .get("/", recursoController.getAll)
  .get("/:id", recursoController.getById)
  .get("/sala/:id", recursoController.getBySala)
  .post("/", verifyToken, recursoController.create)
  .post("/sala", verifyToken, recursoController.assignRecurso)
  .put("/sala", verifyToken, recursoController.updateBySala)
  .put("/:id", verifyToken, recursoController.update)
  .delete("/sala", verifyToken, recursoController.unassignRecurso)
  .delete("/:id", verifyToken, recursoController._delete)

module.exports = router;
