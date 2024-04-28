const db = require("../index");
const user = require("./usuario");
const rol = require("./rol");

const UsuarioRol = db.define("usuarios_roles", {});

rol.belongsToMany(user, {
  through: UsuarioRol,
  foreignKey: "rol_id",
  otherKey: "user_id",
});

user.belongsToMany(rol, {
  through: UsuarioRol,
  foreignKey: "user_id",
  otherKey: "rol_id",
});

module.exports = UsuarioRol;
