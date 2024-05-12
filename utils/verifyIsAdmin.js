const RolService = require("../services/RolService");
const UsuarioRolService = require("../services/UsuarioRolService");

const usuarioRolService = new UsuarioRolService();
const rolService = new RolService();

const verifyIsAdmin = async (uid) => {
  const rolAdmin = await rolService.find({ nombre: "admin" });

  if (rolAdmin.length === 0) {
    return false;
  }

  const results = await usuarioRolService.find({
    usuario_id: uid,
    rol_id: rolAdmin[0].id,
  });

  return [results.length > 0, results[0].id];
};

module.exports = verifyIsAdmin;
