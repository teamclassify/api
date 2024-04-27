const models = require("../db/models");

class SalaService {
  constructor() {}

  async find(building) {
    const query = {};

    if (building) {
      query.where = {
        building,
      };
    }

    const res = await models.Sala.findAll(query);
    return res;
  }

  async findOne(id) {
    const res = await models.Sala.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Sala.create(data);
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
