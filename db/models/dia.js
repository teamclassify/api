const sequelize = require("sequelize");
const db = require("../index");

const dias = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miercoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sabado'
}

const dia = db.define(
  "dia",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    nombre: {type: sequelize.STRING},
    fecha: { type: sequelize.DATE},
    horario_id: {type: sequelize.INTEGER, references: {model: 'horario', key: 'id'}}
  },
  {
    timestamps: false,
  }
);

dia.associate = function (models) {
  dia.hasMany(models.Hora, { as: "hora" });
};

module.exports = dia;
