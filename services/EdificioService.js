const models = require("../db/models");
const db = require("../db/index")

class EdificioService {
  constructor() {}

  async find() {
    const res = await models.Edificio.findAll();
    return res;
  }

  async findOne(id) {
    const res = await models.Edificio.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Edificio.create(data);
    return res;
  }

  async findName(name){
    const res = await db.query(`SELECT * FROM edificios WHERE nombre = '${name}'`)
    return res
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

module.exports = EdificioService;
