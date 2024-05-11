const express = require("express");
const router = express.Router();
const fileController = require("../controllers/FileController");
const verifyToken = require("../middlewares/verifyToken");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
  );

module.exports = router;
