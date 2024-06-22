const express = require("express");
const router = express.Router();

const recursoController = require("../controllers/RecursoController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdminsOrSupport = require("../middlewares/onlyAdminsOrSupport");

router
  .get("/", recursoController.getAll)
  .get("/:id", recursoController.getById)
  .get("/sala/:id", recursoController.getBySala)
  .post("/", verifyToken, onlyAdminsOrSupport, recursoController.create)
  .post("/sala", verifyToken, onlyAdminsOrSupport, recursoController.assignRecurso)
  .put("/sala", verifyToken, onlyAdminsOrSupport, recursoController.updateBySala)
  .put("/:id", verifyToken, onlyAdminsOrSupport, recursoController.update)
  .delete("/sala", verifyToken, onlyAdminsOrSupport, recursoController.unassignRecurso)
  .delete("/:id", verifyToken, onlyAdminsOrSupport, recursoController._delete)

module.exports = router;
