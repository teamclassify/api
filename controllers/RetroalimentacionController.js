const retroService = require('../services/RetroalimentacionService');
service = new retroService();

const create = async (req, res) => {
    try {
      const response = await service.create(req.body);
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
      const response = await service.find();
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

const getBySala = async (req, res) => {
    try {
      const response = await service.getBySala(req.body.sala_id);
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

const getByUsuario = async (req, res) => {
    try {
      const response = await service.find({usuario_id: req.body.usuario_id});
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

const getByRol = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await service.getByRol(id);
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

module.exports = {
    create,
    getAll,
    getBySala,
    getByUsuario,
    getByRol
};