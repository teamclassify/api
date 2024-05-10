const express = require("express");
const router = express.Router();
const fileController = require("../controllers/FileController");
const verifyToken = require("../middlewares/verifyToken");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, "doc.xlsx")
  }
})

const upload = multer({storage});

router
  .post("/upload/clases", verifyToken, upload.single('file'), fileController.uploadClases)
  .post("/upload/salas", verifyToken, upload.single('file'), fileController.uploadSalas)

module.exports = router;
