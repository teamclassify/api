const calendarioModel = require("./calendario");
const edificioModel = require("./edificio");
const salaModel = require("./sala");
const prestamoModel = require("./prestamo");

const models = {};

models.Edificio = edificioModel;
models.Sala = salaModel;
models.Calendario = calendarioModel;
models.Prestamo = prestamoModel;

module.exports = models;
