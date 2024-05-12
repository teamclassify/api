const UserService = require("../services/UserService");
const verifyIsAdmin = require("../utils/verifyIsAdmin");

const service = new UserService();

async function get(req, res) {
  const [isAdmin] = await verifyIsAdmin(req.uid);

  if (!isAdmin) {
    res
      .status(401)
      .json({ success: false, data: "Este usuario no tiene permisos" });
  }

  try {
    const users = await service.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

async function getById(req, res) {
  const [isAdmin] = await verifyIsAdmin(req.uid);

  if (!isAdmin) {
    res
      .status(401)
      .json({ success: false, data: "Este usuario no tiene permisos" });
  }

  try {
    const user = await service.findOne(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = {
  get,
  getById,
};
