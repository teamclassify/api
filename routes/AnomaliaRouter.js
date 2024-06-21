const express = require("express");
const router = express.Router();

const anomaliaController = require("../controllers/AnomaliaController");
const verifyToken = require("../middlewares/verifyToken");
const onlyAdminsOrSupport = require("../middlewares/onlyAdminsOrSupport");

router
  .get("/", verifyToken, onlyAdminsOrSupport, anomaliaController.getAll)
  .post("/", verifyToken, anomaliaController.create)

module.exports = router;
