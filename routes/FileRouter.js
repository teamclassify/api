const express = require("express");
const router = express.Router();
const fileController = require("../controllers/FileController");
const verifyToken = require("../middlewares/verifyToken");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .post(
    "/upload/clases",
    verifyToken,
    upload.single("file"),
    fileController.uploadClases
  )
  .post(
    "/upload/salas",
    verifyToken,
    upload.single("file"),
    fileController.uploadSalas
  )
  .post(
    "/upload/recursos",
    verifyToken,
    upload.single("file"),
    fileController.uploadRecursos
  );

module.exports = router;
