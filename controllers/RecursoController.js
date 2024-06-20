const SalaRecursosService = require("../services/SalaRecursoService");
const SalaService = require("../services/SalaService");
const RecursoService = require("../services/RecursoService");

const salaRecursoService = new SalaRecursosService();
const salaService = new SalaService();
const recursoService = new RecursoService();

const create = async (req, res) => {
  try {
    const body = req.body;
    const response = await salaRecursoService.create(body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getAll = async (res) => {
  try {
    const salasRecursos = await salaRecursoService.getAll();
    res.json({ success: true, data: salasRecursos });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getBySala = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await salaRecursoService.getBySala(id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const assignRecurso = async (req, res) => {
  try {
    const { sala_id, recurso_id } = req.body;
    const response = await salaRecursoService.assignRecurso(sala_id, recurso_id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const unassignRecurso = async (req, res) => {
  try {
    const { sala_id, recurso_id } = req.body;
    const response = await salaRecursoService.unassignRecurso(sala_id, recurso_id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getAvaliable = async (req, res) => {
  try {
    const { sala_id } = req.params;
    const response = await salaRecursoService.getAvaliableRecursos(sala_id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = {
  create,
  getAll,
  getBySala,
  assignRecurso,
  unassignRecurso,
  getAvaliable
};
