const UserService = require("../services/UserService");
const service = new UserService();
const models = require("../db/models");

const login = async (req, res) => {
  try {
    const user = await service.findOne(req.uid);

    // TODO: check body

    if (!user) {
      const user = await service.create({ ...req.body, id: req.uid, codigo: "" });

      await models.UsuarioRol.create({ rol_id: 0, usuario_id: user.id });

      return res.status(200).json({ success: true });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "No auth" });
  }
};

const me = async (req, res) => {
  try {
    res.status(200).json({ uid: req.uid });
  } catch (error) {
    res.status(500).json({ success: false, message: "No auth" });
  }
};

module.exports = {
  login,
  me,
};
