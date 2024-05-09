const models = require("../db/models");

class PrestamoService {
  constructor() {}

  async find() {
    const res = await models.Prestamo.findAll();
    return res;
  }

  async findOne(id) {
    const res = await models.Prestamo.findByPk(id);
    return res;
  }

  async create(data, uid) {
    const res = await models.Prestamo.create({
      usuario_id: uid,
      razon: data.razon,
      estado: "PENDIENTE",
      cantidad_personas: data.cantidad_personas,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      fecha: data.fecha,
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

module.exports = PrestamoService;

