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
    const [results] = await db.query(`SELECT e.id, c.cod_asignatura, h.hora_inicio, h.hora_fin, c.nombre, d.nombre as dia , s.nombre as sala FROM evento e INNER JOIN hora h ON h.evento_id = e.id INNER JOIN dia d ON h.dia_id  = d.id  INNER JOIN horario h2 ON d.horario_id = h2.id INNER JOIN salas s ON s.id  = h2.sala_id INNER JOIN clase c ON c.id = e.clase_id WHERE s.id = ${sala_id}`);

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