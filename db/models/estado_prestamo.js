const sequelize = require("sequelize");
const db = require("../index");

const states = {
  pendiente : 'Pendiente',
  pre_aprobado: 'Pre-aprobado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  completado: 'Completado',
  en_progreso: 'En progreso'
}

const estado = db.define(
  "estado_prestamo",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    nombre: {type: sequelize.STRING, default: states.pendiente}
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

estado.associate = function (models) {
  estado.hasMany(models.Prestamo, { as: "prestamo" });
};

estado.associate = function (models) {
  estado.hasMany(models.Clase, { as: "clase" });
};


module.exports = estado;
