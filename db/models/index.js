const rolModel = require("./rol");
const usuarioModel = require("./usuario");
const calendarioModel = require("./calendario");
const edificioModel = require("./edificio");
const salaModel = require("./sala");
const prestamoModel = require("./prestamo");
const usuarioRolModel = require("./usuario_rol");

const models = {};

models.Rol = rolModel;
models.Usuario = usuarioModel;
models.UsuarioRol = usuarioRolModel;
models.Edificio = edificioModel;
models.Sala = salaModel;
models.Calendario = calendarioModel;
models.Prestamo = prestamoModel;

module.exports = models;
