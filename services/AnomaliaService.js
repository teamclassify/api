const models = require("../db/models");
const db = require("../db/index")

class AnomaliaService {
  constructor() {
  }

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    return models.Anomalia.findAll(query);
  }

  async findOne(id) {
    return models.Anomalia.findByPk(id);
  }

  async create(data) {
    return models.Anomalia.create(data);
  }

  async update(id, data) {
    const model = await this.findOne(id);
    return model.update(data);
  }

  async delete(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    const model = await models.Anomalia.findOne(query);
    await model.destroy();
    return {deleted: true};
  }
}

module.exports = AnomaliaService;
