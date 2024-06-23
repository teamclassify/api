const db = require("../db");
const models = require("../db/models");
const UsuarioRolService = require("./UsuarioRolService");
const EventoService = require("./EventoService");
const {PAGINATION_LIMIT} = require("../config");

const usuarioRolService = new UsuarioRolService();
const eventoService = new EventoService();

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
        p.fecha_inicio,
        p.fecha_fin,
        p.tipo,
        group_concat(pd.dia separator ',') AS dias,
        group_concat(pd.hora_inicio separator ',') AS horas_inicio,
        group_concat(pd.hora_fin separator ',') AS horas_fin,
        s.nombre as sala,
        s.id as sala_id,
        e.nombre as edificio,
        e.id as edificio_id,
        u.nombre as usuario_nombre,
        u.correo as usuario_correo,
        u.photo as usuario_photo,
        u.tipo as usuario_tipo,
        ur.rol_id as usuario_rol,
        u.id as usuario_id
      FROM prestamo p
      LEFT JOIN prestamo_dia pd ON pd.prestamo_id = p.id
      INNER JOIN salas s ON s.id = p.sala_id
      INNER JOIN edificios e ON e.id = s.edificio_id
      INNER JOIN usuario_rols ur ON ur.id = p.usuario_id
      INNER JOIN usuario u ON u.id = ur.usuario_id
      WHERE p.id = ${id}
    `);

    return res.length > 0 ? res[0] : null;
  }

  /*
    Get all prestamos with sala and edificio relations by user id
  */
  async getAllByUserWithRelations(id) {
    // obtener todos los prestamos de un usuario y su sala y edificio
    return usuarioRolService.find({ usuario_id: id }).then((user) => {
      if (!user || user.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      return db
        .query(
          `
        SELECT p.id, p.razon, p.estado, p.cantidad_personas, p.hora_inicio, p.hora_fin, p.fecha, s.nombre as sala, e.nombre as edificio
        FROM prestamo p
        INNER JOIN salas s ON s.id = p.sala_id
        INNER JOIN edificios e ON e.id = s.edificio_id
        WHERE p.usuario_id = ${user[0].id}
      `
        )
        .then(([results]) => {
          return results;
        });
    });
  }

  /*
    Get all prestamos with sala and edificio relations
  */
  async findAllPending() {
    const res = await db.query(`
      SELECT
        p.id,
        p.razon,
        p.estado,
        p.cantidad_personas,
        p.hora_inicio,
        p.hora_fin,
        p.fecha,
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
      FROM prestamo p
      INNER JOIN salas s ON s.id = p.sala_id
      INNER JOIN edificios e ON e.id = s.edificio_id
      INNER JOIN usuario_rols ur ON ur.id = p.usuario_id
      INNER JOIN usuario u ON u.id = ur.usuario_id
      WHERE p.estado = 'PENDIENTE'
      ORDER BY p.id;
    `);

    return res.length > 0 ? res[0] : null;
  }
  
  async count(filters = [], reason = "") {
    const res = await db.query(`
        SELECT COUNT(*) as count
        FROM prestamo p
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
  async findAllByFilters(filters = [], reason = "", page = 0) {
    const res = await db.query(`
        SELECT
          p.id,
          p.razon,
          p.estado,
          p.cantidad_personas,
          p.hora_inicio,
          p.hora_fin,
          p.fecha,
          p.fecha_inicio,
          p.fecha_fin,
          p.tipo,
          group_concat(pd.dia separator ',') AS dias,
          group_concat(pd.hora_inicio separator ',') AS horas_inicio,
          group_concat(pd.hora_fin separator ',') AS horas_fin,
          s.nombre as sala,
          s.id as sala_id,
          e.nombre as edificio,
          e.id as edificio_id,
          p.recursos,
          u.username as usuario_username,
          u.nombre as usuario_nombre,
          u.correo as usuario_correo,
          u.photo as usuario_photo,
          u.tipo as usuario_tipo,
          ur.rol_id as usuario_rol,
          u.id as usuario_id
        FROM prestamo p
        LEFT JOIN prestamo_dia pd ON pd.prestamo_id = p.id
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
        GROUP BY p.id
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

        return eventoService
          .findBySalaAndRangeHours(
            data.sala_id,
            data.fecha,
            data.hora_inicio,
            data.hora_fin
          )
          .then((eventos) => {
            if (eventos.length > 0) {
              throw new Error("Ya hay un evento en ese rango de horas");
            }

            return models.Prestamo.create({
              usuario_id: user[0].id,
              razon: data.razon,
              estado: "PENDIENTE",
              cantidad_personas: data.cantidad_personas,
              hora_inicio: data.tipo === 'SEMESTRAL' ? null : data.hora_inicio,
              hora_fin: data.tipo === 'SEMESTRAL' ? null : data.hora_fin,
              fecha: data.tipo === 'SEMESTRAL' ? null : data.fecha,
              sala_id: data.sala_id,
              recursos: data.recursos || "",
              fecha_inicio: data.tipo === 'UNICO' ? data.fecha : data.fecha_inicio,
              fecha_fin: data.tipo === 'UNICO' ? data.fecha : data.fecha_fin,
              tipo: data.tipo
            })
              .then((prestamo) => {
                
                if (prestamo.tipo === 'UNICO') {
                  return prestamo;
                } else {
                  // crear prestamo_dia
                  return Promise.all(
                    data?.dias?.map(dia => {
                      return models.PrestamoDia.create({
                        prestamo_id: prestamo.id,
                        dia: dia.dia,
                        hora_inicio: dia.hora_inicio,
                        hora_fin: dia.hora_fin
                      })
                    })
                  )
                }
                
              })
              .catch((error) => {
                throw new Error(error.message);
              });
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  async update(id, data) {
    const model = await models.Prestamo.findByPk(id);
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
