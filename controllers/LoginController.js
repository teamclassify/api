const UserService = require("../services/UserService");
const service = new UserService();
const models = require("../db/models");

const login = async (req, res) => {
  try {
    const user = await service.findOne(req.uid);

    // TODO: check body

    if (!user) {
      return service
        .create({ ...req.body, id: req.uid, codigo: "" })
        .then(() => {
          models.UsuarioRol.create({ rol_id: 1, usuario_id: req.uid }).then(
            () => {
              return res.status(200).json({ success: true, data: user });
            }
          );
        });
    }

    res.status(200).json({ success: true, data: user });
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
