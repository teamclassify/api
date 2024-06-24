const models = require("../db/models");
const db = require("../db/index")

class UsuarioRolService {
  constructor() {
  }

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    const res = await models.UsuarioRol.findAll(query);
    return res;
  }

  async findOne(id) {
    const res = await models.UsuarioRol.findByPk(id);
    return res;
  }

  async findWithRelations(uid) {
    const [res] = await db.query(`
      SELECT
        u.nombre,
        u.correo,
        u.estado,
        u.id,
        u.tipo,
        group_concat(r.nombre separator ',') AS rol,
        group_concat(r.id separator ',') AS rol_id
      FROM usuario_rols ur
      INNER JOIN usuario u ON u.id = ur.usuario_id
      JOIN rols r ON r.id = ur.rol_id
      WHERE u.id = '${uid}'
      group by u.id
    `);

    return res.length > 0 ? res[0] : null;
  }

  async findSoporte() {
    const [res] = await db.query(`
      SELECT
        u.nombre,
        u.correo,
        u.estado,
        u.id,
        u.tipo
      FROM usuario_rols ur
      INNER JOIN usuario u ON u.id = ur.usuario_id
      JOIN rols r ON r.id = ur.rol_id
      WHERE r.nombre = 'soporte_tecnico'
      group by u.id
    `);

    return res.length > 0 ? res : null;
  }

  async create(data) {
    const user = await models.UsuarioRol.create(data);
    return user;
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
    
    const model = await models.UsuarioRol.findOne(query);
    await model.destroy();
    return {deleted: true};
  }
}

module.exports = UsuarioRolService;
