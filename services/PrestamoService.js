const db = require("../db");
const models = require("../db/models");
const UsuarioRolService = require("./UsuarioRolService");
const EventoService = require("./EventoService");

const usuarioRolService = new UsuarioRolService();
const eventoService = new EventoService();

class PrestamoService {
  constructor() {}

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    const res = await models.Prestamo.findAll(query);
    return res;
  }

  async findOne(id) {
    const [res] = await db.query(`
      SELECT p.id, p.razon, p.estado, p.cantidad_personas, p.hora_inicio, p.hora_fin, p.fecha, s.nombre as sala, e.nombre as edificio
      FROM prestamo p
      INNER JOIN salas s ON s.id = p.sala_id
      INNER JOIN edificios e ON e.id = s.edificio_id
      WHERE p.id = ${id}
    `);

    return res.length > 0 ? res[0] : null;
  }

  async getAllByUserWithRelations(id) {
    // obtener todos los prestamos de un usuario y su sala y edificio
    return usuarioRolService.find({ usuario_id: id }).then((user) => {
      if (!user || user.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return db
        .query(
          `
        SELECT p.id, p.razon, p.estado, p.cantidad_personas, p.hora_inicio, p.hora_fin, p.fecha, s.nombre as sala, e.nombre as edificio
        FROM prestamo p
        INNER JOIN salas s ON s.id = p.sala_id
        INNER JOIN edificios e ON e.id = s.edificio_id
        WHERE p.usuario_id = ${user[0].id}
      `
        )
        .then(([results]) => {
          return results;
        });
    });
  }

  async findAllPending() {
    const res = await db.query(`
      SELECT p.id, p.razon, p.estado, p.cantidad_personas, p.hora_inicio, p.hora_fin, p.fecha, s.nombre as sala, e.nombre as edificio
      FROM prestamo p
      INNER JOIN salas s ON s.id = p.sala_id
      INNER JOIN edificios e ON e.id = s.edificio_id
      WHERE p.estado = 'PENDIENTE'
    `);

    return res.length > 0 ? res[0] : null;
  }

  async create(data, uid) {
    return usuarioRolService.find({ usuario_id: uid }).then((user) => {
      if (!user || user.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return eventoService
        .findBySalaAndRangeHours(
          data.sala_id,
          data.fecha,
          data.hora_inicio,
          data.hora_fin
        )
        .then((eventos) => {
          if (eventos.length > 0) {
            throw new Error("Ya hay un evento en ese rango de horas");
          }

          return models.Prestamo.create({
            usuario_id: user[0].id,
            razon: data.razon,
            estado: "PENDIENTE",
            cantidad_personas: data.cantidad_personas,
            hora_inicio: data.hora_inicio,
            hora_fin: data.hora_fin,
            fecha: data.fecha,
            sala_id: data.sala_id,
          })
            .then((prestamo) => {
              return prestamo;
            })
            .catch((error) => {
              throw new Error(error);
            });
        });
    });
  }

  async update(id, data) {
    const model = await this.findOne(id);
    const res = await model.update(data);
    return res;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { deleted: true };
  }
}

module.exports = PrestamoService;
