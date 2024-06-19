const db = require("../db");

class StatsService {
  constructor() {}

  async getLoansTotal() {
    const res = await db.query(`
        SELECT estado, COUNT(*) AS cantidad_prestamos
        FROM prestamo
        GROUP BY estado;
    `);

    return res.length > 0 ? res[0] : null;
  }
  
  async getLoansMonths() {
    const res = await db.query(`
      SELECT
        YEAR(fecha) AS anio,
        MONTH(fecha) AS mes,
        estado,
        COUNT(*) AS cantidad_prestamos
      FROM prestamo
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
  
}

module.exports = StatsService;
