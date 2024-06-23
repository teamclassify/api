const SalaRecursosService = require("../services/SalaRecursoService");
const RecursoService = require("../services/RecursoService");

const salaRecursoService = new SalaRecursosService();
const recursoService = new RecursoService();

const create = async (req, res) => {
  try {
    const body = req.body;
    const response = await recursoService.create(body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const response = await recursoService.update(id, body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const _delete = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await recursoService.delete(id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await recursoService.findOne(id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const getAll = async (_, res) => {
  try {
    const salasRecursos = await recursoService.find();
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

const getByEstado = async (req, res) => {
  try {
    const response = await salaRecursoService.getByEstado(req.body.estado);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const updateBySala = async (req, res) =>{
  try {
    const body = req.body;
    if(body.activo === null){
      return res.status(500).json({ success: false, data: null });
    }
    const response = await salaRecursoService.update(body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const assignRecurso = async (req, res) => {
  try {
    const body = req.body;
    const response = await salaRecursoService.create(body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

const unassignRecurso = async (req, res) => {
  const { id } = req.body
  
  if (id === null) {
    return res.status(401).json({ success: false, message: "Debes ingresar un ID" })
  }
  
  try {
    const response = await salaRecursoService.delete(req.body.id);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
}

module.exports = {
  create,
  update,
  _delete,
  getAll,
  getBySala,
  getByEstado,
  updateBySala,
  assignRecurso,
  unassignRecurso,
  getById,
};
