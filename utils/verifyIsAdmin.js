const RolService = require("../services/RolService");
const UsuarioRolService = require("../services/UsuarioRolService");

const usuarioRolService = new UsuarioRolService();
const rolService = new RolService();

const verifyIsAdmin = async (uid) => {
  const rolAdmin = await rolService.find({ nombre: "admin" });

  if (rolAdmin.length === 0) {
    return [false, null];
  }

  const results = await usuarioRolService.find({
    usuario_id: uid,
    rol_id: rolAdmin[0]?.id,
  });

  return [results.length > 0, results[0]?.id];
};

const verifyIsSuperAdmin = async (uid) => {
  const rolAdmin = await rolService.find({ nombre: "superadmin" });

  if (rolAdmin.length === 0) {
    return [false, null];
  }

  const results = await usuarioRolService.find({
    usuario_id: uid,
    rol_id: rolAdmin[0]?.id,
  });

  return [results.length > 0, results[0]?.id];
};

const verifyIsAdminOrSupport = async (uid) => {
  const rolAdmin = await rolService.find({ nombre: "admin" });
  const rolSupport = await rolService.find({ nombre: "soporte_tecnico" });

  if (rolAdmin.length === 0 || rolSupport.length === 0) {
    return [false, null];
  }

  const results = await usuarioRolService.find({
    usuario_id: uid
  });
  
  const isAllowed = results.filter(userRole => {
    return (userRole.rol_id === rolAdmin[0]?.id) || (userRole.rol_id === rolSupport[0]?.id)
  });
  
  return [isAllowed.length > 0, isAllowed[0]?.id];
};

module.exports = { verifyIsAdmin, verifyIsSuperAdmin, verifyIsAdminOrSupport };
