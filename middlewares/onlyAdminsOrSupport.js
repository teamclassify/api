const { verifyIsAdminOrSupport } = require("../utils/verifyIsAdmin");

const onlyAdminsOrSupport = async (req, res, next) => {
  const [isAllowed] = await verifyIsAdminOrSupport(req.uid);

  if (!isAllowed) {
    return res
      .status(401)
      .json({success: false, data: "Este usuario no tiene permisos para esta accion."});
  } else {
    next();
  }
};

module.exports = onlyAdminsOrSupport;
