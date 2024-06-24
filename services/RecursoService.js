const models = require("../db/models");
const db = require("../db");

class RecursoService {
  constructor() {}

  async find(query = {}) {
    const res = await models.Recurso.findAll(query);
    return res;
  }

  async findUniques() {
    const res = await db.query(`
        SELECT nombre, COUNT(id) AS id_count
        FROM recursos
        GROUP BY nombre
      `);

    return res.length > 0 ? res[0] : null;
  }

  async findOne(id) {
    const res = await models.Recurso.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Recurso.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      img: data.img
    });
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

module.exports = RecursoService;
