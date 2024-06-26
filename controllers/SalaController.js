const SalaService = require("../services/SalaService");
const service = new SalaService();

const create = async (req, res) => {
  try {
    const response = await service.create(req.body);

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const get = async (req, res) => {
  const { building } = req.params;

  try {
    const response = await service.find({ edificio_id: building });

    res.json(response);
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

const getSalasDisponibles = async (req, res) => {
  try {
    const { fecha, start_hour, end_hour } = req.query;
    const response = await service.getSalasDisponibles(fecha, start_hour, end_hour);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getSalasDisponiblesRango = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, dias } = req.body;
    const response = await service.getSalasDisponiblesRango(fecha_inicio, fecha_fin, dias);
    res.json({ success: true, data: response });
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
  getSalasDisponibles,
  getSalasDisponiblesRango
};
