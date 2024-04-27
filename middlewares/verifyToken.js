const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).json({ error: "No auth" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = verified;

    next();
  } catch (error) {
    res.status(400).json({ error: "invalid token" });
  }
};

module.exports = verifyToken;
