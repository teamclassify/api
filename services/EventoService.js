const db = require("../db/index");
const models = require("../db/models");

class EventoService {
  constructor() {}

  async find() {
    const res = await models.Evento.findAll();
    return res;
  }

  async findOne(id) {
    const res = await models.Evento.findByPk(id);
    return res;
  }

  async findBySala(sala_id) {
    const [results] = await db.query(
      `(SELECT e.id, d.fecha, c.cod_asignatura, h.hora_inicio, h.hora_fin, c.nombre, e.asistencia,
        d.nombre as dia , s.nombre as sala, c.estado, c.cod_docente, 'clase' as tipo, s.capacidad as cantidad_personas, NULL as prestamo_tipo,
        NULL as usuario_id, NULL as usuario_nombre, NULL as usuario_foto, NULL as usuario_codigo, NULL as usuario_username
      FROM salas s
      INNER JOIN horarios h2 ON s.id = h2.sala_id
      INNER JOIN dia d ON h2.id = d.horario_id
      INNER JOIN horas h ON d.id = h.dia_id
      INNER JOIN evento e ON h.evento_id = e.id
      INNER JOIN clase c ON e.clase_id = c.id
      WHERE c.estado = 'APROBADO' AND s.id = ${sala_id}) UNION
      (SELECT e.id, d.fecha, NULL as cod_asignatura, h.hora_inicio, h.hora_fin, p.razon as nombre, e.asistencia,
        d.nombre as dia , s.nombre as sala, p.estado, NULL as cod_docente, 'prestamo' as tipo, p.cantidad_personas, p.tipo as prestamo_tipo,
       u.id as usuario_id, u.nombre as usuario_nombre, u.photo as usuario_foto, u.codigo as usuario_codigo, u.username as usuario_username
      FROM salas s
      INNER JOIN horarios h2 ON s.id = h2.sala_id
      INNER JOIN dia d ON h2.id = d.horario_id
      INNER JOIN horas h ON d.id = h.dia_id
      INNER JOIN evento e ON h.evento_id = e.id
      INNER JOIN prestamo p ON e.prestamo_id = p.id
      INNER JOIN usuario_rols ur ON ur.id = p.usuario_id
      INNER JOIN usuario u ON u.id = ur.usuario_id
      WHERE p.estado = 'APROBADO' AND s.id = ${sala_id})
      `
    );

    return results;
  }

  async findBySalaAndRangeHours(sala_id, fecha, start_hour, end_hour) {
    if (fecha === null || start_hour ===  null || end_hour === null) return [];
    
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
      `SELECT e.id, h.hora_inicio, h.hora_fin,
        d.nombre as dia , s.nombre as sala, s.capacidad as cantidad_personas
      FROM salas s
      INNER JOIN horarios h2 ON s.id = h2.sala_id
      INNER JOIN dia d ON h2.id = d.horario_id
      INNER JOIN horas h ON d.id = h.dia_id
      INNER JOIN evento e ON h.evento_id = e.id
      WHERE s.id = ${sala_id} AND ((e.clase_id IS NOT NULL AND d.nombre = '${diaNombre}') OR (e.prestamo_id IS NOT NULL AND d.fecha = '${fecha}'))
      
      AND (
        (h.hora_inicio = ${start_hour})
        OR
        (h.hora_inicio = ${start_hour} AND h.hora_fin = ${end_hour})
        OR
        (h.hora_inicio >= ${start_hour} AND h.hora_inicio < ${end_hour})
        OR
        (h.hora_fin > ${start_hour} AND h.hora_fin <= ${end_hour})
      )
      `
    );

    return results;
  }

  async create(data) {
    const res = await models.Evento.create(data);
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

module.exports = EventoService;
