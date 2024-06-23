const db = require("../db");
const models = require("../db/models");
const UsuarioRolService = require("./UsuarioRolService");
const {PAGINATION_LIMIT} = require("../config");

const usuarioRolService = new UsuarioRolService();

class PrestamoRecurrenteService {
  constructor() {}

  async find(params) {
    const query = {};

    if (params) {
      query.where = params;
    }

    const res = await models.PrestamoRecurrente.findAll(query);
    return res;
  }

  /*
    Get prestamo with sala and edificio relations by id
  */
  async findOne(id) {
    const [res] = await db.query(`
      SELECT
        p.id,
        p.razon,
        p.estado,
        p.cantidad_personas,
        p.hora_inicio,
        p.hora_fin,
        p.fecha,
        p.recursos,
        p.razon_cancelacion,
        s.nombre as sala,
        s.id as sala_id,
        e.nombre as edificio,
        e.id as edificio_id,
        u.nombre as usuario_nombre,
        u.correo as usuario_correo,
        ur.rol_id as usuario_rol,
        u.id as usuario_id
      FROM prestamo p
      INNER JOIN salas s ON s.id = p.sala_id
      INNER JOIN edificios e ON e.id = s.edificio_id
      INNER JOIN usuario_rols ur ON ur.id = p.usuario_id
      INNER JOIN usuario u ON u.id = ur.usuario_id
      WHERE p.id = ${id}
    `);

    return res.length > 0 ? res[0] : null;
  }
  
  async count(filters = [], reason = "") {
    const res = await db.query(`
        SELECT COUNT(*) as count
        FROM prestamo_recurrente p
        INNER JOIN salas s ON s.id = p.sala_id
        INNER JOIN edificios e ON e.id = s.edificio_id
        INNER JOIN usuario_rols ur ON ur.id = p.usuario_id
        INNER JOIN usuario u ON u.id = ur.usuario_id
        ${
      filters.length > 0
        ? `WHERE (${filters
          .map((filter) => {
            return `${filter.name} = '${filter.value}'`;
          })
          .join(" OR ")}) AND`
        : "WHERE"
    }
        p.razon LIKE '%${reason}%'
      `);

    return res.length > 0 ? res[0] : null;
  }

  /*
    Get all prestamos with sala and edificio relations with filters
  */
  async findAll(filters = [], reason = "", page = 0) {
    const res = await db.query(`
        SELECT
          p.id,
          p.razon,
          p.estado,
          p.fecha_inicio,
          p.fecha_fin,
          s.nombre as sala,
          s.id as sala_id,
          e.nombre as edificio,
          e.id as edificio_id,
          p.recursos,
          u.username as usuario_username,
          u.nombre as usuario_nombre,
          u.correo as usuario_correo,
          u.photo as usuario_photo,
          ur.rol_id as usuario_rol,
          u.id as usuario_id
        FROM prestamo_recurrente p
        INNER JOIN salas s ON s.id = p.sala_id
        INNER JOIN edificios e ON e.id = s.edificio_id
        INNER JOIN usuario_rols ur ON ur.id = p.usuario_id
        INNER JOIN usuario u ON u.id = ur.usuario_id
        ${
      filters.length > 0
        ? `WHERE (${filters
          .map((filter) => {
            return `${filter.name} = '${filter.value}'`;
          })
          .join(" OR ")}) AND`
        : "WHERE"
    }
        p.razon LIKE '%${reason}%'
        ORDER BY p.updatedAt DESC
        LIMIT ${PAGINATION_LIMIT} OFFSET ${page * PAGINATION_LIMIT}
      `);

    return res.length > 0 ? res[0] : null;
  }

  /*
    Create new prestamo with user id
    @param {Object} data prestamo data
    @param {Number} uid user id
  */
  async create(data, uid) {
    return usuarioRolService
      .find({ usuario_id: uid })
      .then((user) => {
        if (!user || user.length === 0) {
          throw new Error("Usuario no encontrado");
        }

        return models.PrestamoRecurrente.create({
          usuario_id: user[0].id,
          razon: data.razon,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          sala_id: data.sala_id,
          recursos: data.recursos || "",
        })
          .then((prestamo) => {
            return Promise.all(
              data?.dias.map(dia => {
                return models.PrestamoDia.create({
                  prestamo_recurrente_id: prestamo.id,
                  hora_inicio: dia.hora_inicio,
                  hora_fin: dia.hora_fin,
                  dia: dia.dia
                })
              })
            )
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      })
  }

  async update(id, data) {
    const model = await models.PrestamoRecurrente.findByPk(id);
    const res = await model.update(data);
    return res;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { deleted: true };
  }
}

module.exports = PrestamoRecurrenteService;
