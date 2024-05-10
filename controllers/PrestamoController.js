const PrestamoService = require("../services/PrestamoService");
const UsuarioRolService = require("../services/UsuarioRolService");

const service = new PrestamoService();
const usuarioRolService = new UsuarioRolService();

const create = async (req, res) => {
  if (
    !req.body.razon ||
    !req.body.fecha ||
    !req.body.hora_fin ||
    !req.body.hora_inicio ||
    !req.body.cantidad_personas
  ) {
    return res.status(400).send({ success: false, message: "Faltan datos" });
  }

  try {
    const response = await service.create(req.body, req.uid);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const response = await service.getAllByUserWithRelations(req.uid);
    res.status(200).json({ sucess: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await service.findOne(id);
    res.json(response);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const response = await service.update(id, body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const _delete = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await service.delete(id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  create,
  get,
  getById,
  update,
  _delete,
};
