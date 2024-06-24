const EventoService = require("../services/EventoService");
const PrestamoService = require("../services/PrestamoService");
const sendEmail = require("../utils/sendEmail");
const service = new EventoService();
const prestamoService = new PrestamoService();

const create = async (req, res) => {
  try {
    const response = await service.create(req.body);

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    const response = await service.find();

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

const getAllBySala = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await service.findBySala(id);
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
    
    const prestamo = await prestamoService.findOne(response?.prestamo_id)
    
    if (response?.asistencia) {
      await sendEmail({
        to: prestamo?.usuario_correo,
        subject: "Gracias por hacer uso de la sala | Préstamo de Salas",
        message: `
          <p>Nos ayudaria tu feedback sobre el préstamo: <a href="${`https://app-classify.vercel.app/home`}">https://app-classify.vercel.app/home</a>, selecciona los 3 puntos de tu prestamo y ayudanos dejando tu nivel de satisfaccion.</p>
          <p>Tambien puedes enviar si encontraste alguna anomalia: <a href="${`https://app-classify.vercel.app/anomalias/nueva/${response?.prestamo_id}`}">https://app-classify.vercel.app/anomalias/nueva/${response?.prestamo_id}</a></p>
        `
      })
    }
    
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
  getAllBySala,
  update,
  _delete,
};
