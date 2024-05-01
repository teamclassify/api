const db = require("../index");
const user = require("./usuario");
const rol = require("./rol");

const UsuarioRol = db.define("usuario_rol", {});

rol.belongsToMany(user, {
  through: UsuarioRol,
  foreignKey: "rol_id",
  otherKey: "usuario_id",
});

user.belongsToMany(rol, {
  through: UsuarioRol,
  foreignKey: "usuario_id",
  otherKey: "rol_id",
});

module.exports = UsuarioRol;
