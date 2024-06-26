const db = require("../index");
const user = require("./usuario");
const rol = require("./rol");
const sequelize = require("sequelize");

const UsuarioRol = db.define("usuario_rol", {
  id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
});

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
