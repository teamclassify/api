const express = require("express");
const router = express.Router();
const loginController = require("../controllers/LoginController");

const verifyToken = require("../middlewares/verifyToken");

router.get("/me", verifyToken, loginController.me);
router.post("/login", loginController.login);
router.post("/register", loginController.register);

module.exports = router;
