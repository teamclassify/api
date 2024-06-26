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
      SELECT
        sr.id,
        r.nombre,
        r.descripcion,
        r.img, r.id AS recurso_id
        FROM sala_recursos sr
        INNER JOIN recursos r ON sr.recurso_id = r.id
        WHERE sr.sala_id = ${id}
    `);
    return res.length > 0 ? res : null;
  }

  async getByEstado(estado) {
    const [res] = await db.query(`
      SELECT r.nombre as recurso, e.nombre as edificio, s.nombre as sala, r.descripcion, r.img FROM sala_recursos sr
        INNER JOIN recursos r ON sr.recurso_id = r.id
        INNER JOIN salas s ON sr.sala_id = s.id
        INNER JOIN edificios e ON s.edificio_id = e.id
        WHERE sr.estado = '${estado}'
    `);
    return res.length > 0 ? res : null;
  }

  async create(data) {
    const query = await models.SalaRecurso.findAll({where: {sala_id: data.sala_id, recurso_id: data.recurso_id}});
    if(query.length > 0){
      return null;
    }
    const model = await models.SalaRecurso.create(data);
    return model;
  }

  async update(data) {
    const model = await this.find({sala_id: data.sala_id, recurso_id: data.recurso_id});
    console.log(model)
    if(model.length === 0){
      return null;
    }
    const res = await model[0].update(data);
    return res;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return {deleted: true};
  }
}

module.exports = SalaRecursoService;
