const db = require("../db/index");
const models = require("../db/models");

class RetroalimentacionService {
  constructor() {}

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }
    const res = await models.Retroalimentacion.findAll(query);
    return res;
  }

  async create(data) {
    const res = await models.Retroalimentacion.create(data);
    return res;
  }

  async getBySala(id) {
    const res = await db.query(
        `SELECT u.nombre as usuario, ro.nombre as rol, p.razon, e.nombre as edificio, s.nombre as sala, r.valoracion, r.comentario
        FROM retroalimentacions r
        INNER JOIN prestamo p ON r.prestamo_id = p.id
        INNER JOIN salas s ON p.sala_id = s.id
        INNER JOIN edificios e ON s.edificio_id = e.id
        INNER JOIN usuario_rols ur ON r.usuario_id = ur.id
        INNER JOIN usuario u ON ur.usuario_id = u.id
        INNER JOIN rols ro ON ur.rol_id = ro.id
        WHERE p.sala_id = ${id}
        GROUP BY u.nombre, ro.nombre, p.razon, e.nombre, s.nombre, r.valoracion, r.comentario`
        );
    return res;
  }

  async getByRol(id) {
    const res = await db.query(
        `SELECT u.nombre as usuario, ro.nombre as rol, p.razon, e.nombre as edificio, s.nombre as sala, r.valoracion, r.comentario
        FROM retroalimentacions r
        INNER JOIN prestamo p ON r.prestamo_id = p.id
        INNER JOIN salas s ON p.sala_id = s.id
        INNER JOIN edificios e ON s.edificio_id = e.id
        INNER JOIN usuario_rols ur ON r.usuario_id = ur.id
        INNER JOIN usuario u ON ur.usuario_id = u.id
        INNER JOIN rols ro ON ur.rol_id = ro.id
        WHERE ur.rol_id = ${id}
        GROUP BY u.nombre, ro.nombre, p.razon, e.nombre, s.nombre, r.valoracion, r.comentario`
        );
    return res;
  }

  async getByUsuario(id) {
    const res = await models.Retroalimentacion.find({ usuario_id: id });
    return res;
  }
}

module.exports = RetroalimentacionService;
