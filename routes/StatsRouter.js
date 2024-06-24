const express = require("express");
const router = express.Router();

const statsController = require("../controllers/StatsController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdmins = require("../middlewares/onlyAdmins");

router
  .get("/prestamos/total", verifyToken, onlyAdmins, statsController.getLoansTotal)
  .get("/prestamos/meses", verifyToken, onlyAdmins, statsController.getLoansByMonths)
  .get("/usuarios", verifyToken, onlyAdmins, statsController.getUsers)
  .get("/feedback", verifyToken, onlyAdmins, statsController.getFeedback)

module.exports = router;
