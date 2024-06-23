const rolModel = require("./rol");
const claseModel = require("./clase");
const prestamoModel = require("./prestamo");
const horaModel = require("./hora");
const diaModel = require("./dia");
const usuarioModel = require("./usuario");
const horarioModel = require("./horario");
const edificioModel = require("./edificio");
const salaModel = require("./sala");
const eventoModel = require("./evento");
const usuarioRolModel = require("./usuario_rol");
const recursoModel = require("./recurso");
const salaRecursoModel = require("./sala_recurso");
const retroalimentacionModel = require("./retroalimentacion");
const anomalia = require("./anomalia");
const prestamoDia = require("./prestamo_dia");

const models = {};

models.Rol = rolModel;
models.Usuario = usuarioModel;
models.UsuarioRol = usuarioRolModel;
models.Edificio = edificioModel;
models.Sala = salaModel;
models.Horario = horarioModel;
models.Evento = eventoModel;
models.Clase = claseModel;
models.Prestamo = prestamoModel;
models.Hora = horaModel;
models.Dia = diaModel;
models.Recurso = recursoModel;
models.SalaRecurso = salaRecursoModel;
models.Retroalimentacion = retroalimentacionModel;
models.Anomalia = anomalia;
models.PrestamoDia = prestamoDia;

module.exports = models;
