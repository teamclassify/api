const models = require("../db/models");
const db = require("../db/index");

class SalaService {
  constructor() {}

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    const res = await models.Sala.findAll(query);
    return res;
  }

  async findOne(id) {
    const res = await models.Sala.findByPk(id);
    return res;
  }

  async findById(id) {
    const [results] = await db.query(
      `SELECT s.id, s.nombre as sala, e.nombre as edificio
        FROM salas s
        INNER JOIN edificios e ON e.id = s.edificio_id
        WHERE s.id = ${id}
      `
    );
    return results?.length > 0 ? results[0] : null;
  }

  async getSalasDisponibles(fecha, start_hour, end_hour) {
    const dias = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const dia = new Date(fecha.replaceAll('-', "/")).getDay();
    const diaNombre = dias[dia];

    if (diaNombre === "domingo") {
      throw new Error("No se puede reservar en fin de semana");
    }

    if (!diaNombre) {
      throw new Error("Fecha no válida");
    }
    
    const [results] = await db.query(
      `SELECT s.id, e.nombre as edificio, s.nombre, s.capacidad, s.cantidad_computadores
      FROM salas s
      INNER JOIN edificios e ON s.edificio_id = e.id
      WHERE s.id NOT IN (
        SELECT s.id
        FROM salas s
        INNER JOIN horarios h2 ON s.id = h2.sala_id
        INNER JOIN dia d ON h2.id = d.horario_id
        INNER JOIN horas h ON d.id = h.dia_id
        INNER JOIN evento e ON h.evento_id = e.id
        WHERE ((e.clase_id IS NOT NULL AND d.nombre = '${diaNombre}') OR (e.prestamo_id IS NOT NULL AND d.fecha = '${fecha}'))
        AND (
          (h.hora_inicio = ${start_hour})
          OR
          (h.hora_inicio = ${start_hour} AND h.hora_fin = ${end_hour})
          OR
          (h.hora_inicio >= ${start_hour} AND h.hora_inicio < ${end_hour})
          OR
          (h.hora_fin > ${start_hour} AND h.hora_fin <= ${end_hour})
        )
      )
      `
    );
    return results;
  }

  async getSalasDisponiblesRango(fecha_inicio, fecha_fin, dias) {
    const [results] = await db.query(
      `SELECT s.id, e.nombre as edificio, s.nombre, s.capacidad, s.cantidad_computadores
      FROM salas s
      INNER JOIN edificios e ON s.edificio_id = e.id
      WHERE s.id NOT IN (
        SELECT s.id
        FROM salas s
        INNER JOIN horarios h2 ON s.id = h2.sala_id
        INNER JOIN dia d ON h2.id = d.horario_id
        INNER JOIN horas h ON d.id = h.dia_id
        INNER JOIN evento e ON h.evento_id = e.id
        WHERE ${dias?.map(dia => `((((e.clase_id IS NOT NULL AND d.nombre = '${dia.dia}'))
        AND (
          (h.hora_inicio = ${dia.hora_inicio})
          OR
          (h.hora_inicio = ${dia.hora_inicio} AND h.hora_fin = ${dia.hora_fin})
          OR
          (h.hora_inicio >= ${dia.hora_inicio} AND h.hora_inicio < ${dia.hora_fin})
          OR
          (h.hora_fin > ${dia.hora_inicio} AND h.hora_fin <= ${dia.hora_fin})
        )
      ))`).join(dias.length > 1 ? ' OR ' : ' ')})
      `
    );
    return results;
  }

  async create(data) {
    const res = await models.Sala.create(data);

    await models.Horario.create({
      sala_id: res.id
    })

    return res;
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

module.exports = SalaService;
