const models = require("../db/models");
const db = require("../db/index")

class HorarioService {
  constructor() {}

  async find() {
    const res = await models.Horario.findAll();
    return res;
  }

  /*
    Obtiene el horario de una sala en un edificio
  */
  async findBySala(edificio, sala) {
    const [results] = await db.query(`
      SELECT ed.id as edificio, h.id as horario, s.id as sala
      FROM salas s
      INNER JOIN horarios h ON h.sala_id = s.id
      INNER JOIN edificios ed ON ed.id  = s.edificio_id
      WHERE s.nombre = '${sala}' AND ed.nombre = '${edificio}'`
    );

    return results;
  }

  async findOne(id) {
    const res = await models.Horario.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Horario.create(data);
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

module.exports = HorarioService;