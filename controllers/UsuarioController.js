const UserService = require("../services/UserService");
const UsuarioRolService = require("../services/UsuarioRolService");
const RolService = require("../services/RolService");
const { verifyIsSuperAdmin } = require("../utils/verifyIsAdmin");

const service = new UserService();
const usuarioRolService = new UsuarioRolService();
const rolService = new RolService();

async function get(req, res) {
  const [isAdmin] = await verifyIsSuperAdmin(req.uid);

  if (!isAdmin) {
    return res
      .status(401)
      .json({ success: false, data: "Este usuario no tiene permisos" });
  }

  const state = req.query.estado ?? "";
  const name = req.query.nombre ?? "";
  const rol = req.query.rol ?? "";

  try {
    const users = await service.getAll({ name, state, rol });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

async function getById(req, res) {
  const [isAdmin] = await verifyIsSuperAdmin(req.uid);

  if (!isAdmin) {
    return res
      .status(401)
      .json({ success: false, data: "Este usuario no tiene permisos" });
  }

  try {
    const user = await service.findOne(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, data: "Usuario no encontrado" });
    }

    const userRol = await usuarioRolService.find({ usuario_id: req.params.id });
    const roles = await rolService.find();
    const userRoles = userRol.map((ur) => {
      const rol = roles ? roles.find((r) => r.id === ur.rol_id) : null;
      return rol?.nombre;
    });

    res.json({ success: true, data: { ...user.dataValues, roles: userRoles } });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

async function setRole(req, res) {
  const [isAdmin] = await verifyIsSuperAdmin(req.uid);

  if (!isAdmin) {
    res
      .status(401)
      .json({ success: false, data: "Este usuario no tiene permisos" });
  }

  try {
    const user = await service.setRole(req.params.id, req.body.role);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = {
  get,
  getById,
  setRole,
};
