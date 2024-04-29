const models = require("../db/models");

class ClaseService {
  constructor() {}

  async find() {
    const res = await models.Clase.findAll();
    return res;
  }

  async findOne(id) {
    const res = await models.Clase.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Clase.create(data);
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

module.exports = ClaseService;
