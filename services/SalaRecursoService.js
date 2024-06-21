const models = require("../db/models");
const db = require("../db/index")

class SalaRecursoService {
  constructor() {
  }

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }
    const res = await models.SalaRecurso.findAll(query);
    return res;
  }

  async findOne(id) {
    const res = await models.SalaRecurso.findByPk(id);
    return res;
  }

  async getBySala(id) {
    const [res] = await db.query(`
      SELECT r.nombre, r.descripcion, r.img FROM sala_recursos sr
        INNER JOIN recursos r ON sr.recurso_id = r.id
        WHERE sr.sala_id = ${id}
    `);
    return res.length > 0 ? res[0] : null;
  }

  async create(data) {
    const model = await models.SalaRecurso.create(data);
    return model;
  }

  async update(id, data) {
    const model = await this.findOne(id);
    const res = await model.update(data);
    return res;
  }

  async delete(params) {
    const query = {};

    if (params) {
      query.where = params;
    }
    
    const model = await models.SalaRecurso.findOne(query);
    await model.destroy();
    return {deleted: true};
  }
}

module.exports = SalaRecursoService;
