const db = require("../db");

class StatsService {
  constructor() {}

  async getLoansTotal(year = 'total') {
    const res = await db.query(`
        SELECT estado, COUNT(*) AS cantidad_prestamos
        FROM prestamo
        ${year !== 'total' ? `WHERE YEAR(fecha) = ${year}`: ''}
        GROUP BY estado;
    `);

    return res.length > 0 ? res[0] : null;
  }
  
  async getLoansMonths(year) {
    const res = await db.query(`
      SELECT
        YEAR(fecha) AS anio,
        MONTH(fecha) AS mes,
        estado,
        COUNT(*) AS cantidad_prestamos
      FROM prestamo
      ${year ? `WHERE YEAR(fecha) = ${year}` : ''}
      GROUP BY YEAR(fecha), MONTH(fecha), estado;
    `);

    return res.length > 0 ? res[0] : null;
  }

  async getUsers() {
    const res = await db.query(`
      SELECT
        estado,
        COUNT(*) AS user_count
      FROM usuario
      WHERE estado IN ('ACTIVO', 'INACTIVO')
      GROUP BY estado;
    `);

    return res.length > 0 ? res[0] : null;
  }

  async getFeedback(year = 'total') {
    const res = await db.query(`
      SELECT
        valoracion,
        COUNT(*) AS valoracion_count
      FROM retroalimentacions
      ${year !== 'total' ? `WHERE YEAR(createdAt) = ${year}`: ''}
      GROUP BY valoracion;
    `);

    return res.length > 0 ? res[0] : null;
  }
  
}

module.exports = StatsService;
