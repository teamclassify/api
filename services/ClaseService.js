const models = require("../db/models");
const db = require("../db/index")

class ClaseService {
  constructor() {}

  async find() {
    const res = await models.Clase.findAll();
    return res;
  }

  async findOne(id) {
    const res = await models.Clase.findByPk(id);
    return res;
  }

  async create(data) {
    const res = await models.Clase.create(data);
    //hay que crear los eventos con estado pendiente
    return res;
  }

  async createFromExcel(data) {
    const res = await db.query(`
      INSERT INTO clase
      (nombre, cod_asignatura, cod_docente, grupo, usuario_id, estado, createdAt, updatedAt)
      VALUES
      ('${data.nombre}', '${data.cod_asignatura}', '${data.cod_docente}', '${data.grupo}', '1', 'APROBADO', CURDATE(), CURDATE())`
    );
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

module.exports = ClaseService;
