const models = require("../db/models");
const db = require("../db/index")
const { PAGINATION_LIMIT } = require("../config")

class AnomaliaService {
  constructor() {
  }

  async find(filters = {}, description = "", page = 0) {
    return db.query(`
        SELECT
            a.id AS id,
            a.createdAt,
            a.updatedAt,
            a.estado,
            a.descripcion AS descripcion,
            s.nombre AS sala,
            e.nombre AS edificio,
            u.nombre AS usuario_nombre,
            u.correo AS usuario_correo,
            u.photo AS usuario_photo,
            u.tipo AS usuario_tipo,
            u.id AS usuario_id
        FROM anomalia a
        INNER JOIN salas s ON s.id = a.sala_id 
        INNER JOIN edificios e ON e.id = s.edificio_id 
        INNER JOIN prestamo p ON p.id = a.prestamo_id 
        INNER JOIN usuario u ON u.id = a.usuario_id
        ${
          filters.length > 0
            ? `WHERE (${filters
                .map((filter) => {
                  return `${filter.name} = '${filter.value}'`;
                })
                .join(" OR ")}) AND`
            : "WHERE"
        }
        a.descripcion LIKE '%${description}%'
        ORDER BY a.createdAt DESC
        LIMIT ${PAGINATION_LIMIT} OFFSET ${page * PAGINATION_LIMIT}
    `)
  }

  async count(filters = [], description = "") {
    const res = await db.query(`
        SELECT COUNT(*) as count
        FROM anomalia a
        INNER JOIN salas s ON s.id = a.sala_id 
        INNER JOIN edificios e ON e.id = s.edificio_id 
        INNER JOIN prestamo p ON p.id = a.prestamo_id 
        INNER JOIN usuario u ON u.id = a.usuario_id
        ${
      filters.length > 0
        ? `WHERE (${filters
          .map((filter) => {
            return `${filter.name} = '${filter.value}'`;
          })
          .join(" OR ")}) AND`
        : "WHERE"
    }
        a.descripcion LIKE '%${description}%'
      `);

    return res.length > 0 ? res[0] : null;
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
