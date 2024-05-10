const models = require("../db/models");
const UsuarioRolService = require("./UsuarioRolService");

const usuarioRolService = new UsuarioRolService();

class PrestamoService {
  constructor() {}

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    const res = await models.Prestamo.findAll(query);
    return res;
  }

  async findOne(id) {
    const res = await models.Prestamo.findByPk(id);
    return res;
  }

  async create(data, uid) {
    return usuarioRolService.find({ usuario_id: uid }).then((user) => {
      if (!user || user.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return models.Prestamo.create({
        usuario_id: user[0].id,
        razon: data.razon,
        estado: "PENDIENTE",
        cantidad_personas: data.cantidad_personas,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        fecha: data.fecha,
        sala_id: data.sala_id,
      })
        .then((prestamo) => {
          return prestamo;
        })
        .catch((error) => {
          throw new Error(error);
        });
    });
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
