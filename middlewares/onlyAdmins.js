const { verifyIsAdmin} = require("../utils/verifyIsAdmin");

const onlyAdmins = async (req, res, next) => {
  const [isAdmin] = await verifyIsAdmin(req.uid);

  if (!isAdmin) {
    return res
      .status(401)
      .json({success: false, data: "Este usuario no tiene permisos para esta accion."});
  } else {
    next();
  }
};

module.exports = onlyAdmins;
