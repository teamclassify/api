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
    cb(null, "horario.xlsx")
  }
})

const upload = multer({storage});

router
  .post("/upload", upload.single('file'), fileController.upload)
  .put("/update", verifyToken, fileController.update)
  .delete("/delete", verifyToken, fileController._delete);

module.exports = router;
