const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  TOKEN_SECRET,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  JWT_EXPIRATION_TIME,
} = require("../config");

const login = async (req, res) => {
  try {
    const user = req.body;

    // check admin user and  password
    const validUsername = await bcrypt.compare(user.username, ADMIN_USERNAME);
    const validPassword = await bcrypt.compare(user.password, ADMIN_PASSWORD);

    if (!validUsername || !validPassword) {
      return res.status(500).json({ success: false, message: "No auth" });
    }

    // generate jwt
    const token = jwt.sign(
      {
        name: user.username,
      },
      TOKEN_SECRET,
      {
        expiresIn: JWT_EXPIRATION_TIME,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "No auth" });
  }
};

const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    res.status(200).send({ password });
  } catch (error) {
    res.status(500).send({ success: false, message: "No auth" });
  }
};

const me = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send({ success: false, message: "No auth" });
  }
};

module.exports = {
  login,
  register,
  me,
};
