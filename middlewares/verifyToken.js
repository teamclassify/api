const { auth } = require("../config/firebase");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.split(" ")[1]) {
    return res.status(401).json({ error: "token failed" });
  }

  token = token.split(" ")[1];

  auth
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      req.uid = uid;
      next();
    })
    .catch(() => {
      return res.status(401).json({ error: "invalid token" });
    });
};

module.exports = verifyToken;
