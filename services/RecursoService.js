const models = require("../db/models");

class RecursoService {
  constructor() {}

  async find(query = {}) {
    const res = await models.Recurso.findAll(query);
    return res;
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
