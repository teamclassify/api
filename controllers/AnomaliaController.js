const AnomaliaService = require('../services/AnomaliaService');
const service = new AnomaliaService();

const getAll = async (req, res) => {
  try {
    const response = await service.find();
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const create = async (req, res) => {
  try {
    const {
      sala_id,
      descripcion,
      prestamo_id
    } = req.body;
    
    if (sala_id === null || descripcion === null || prestamo_id === null) {
      return res.status(400).send({success: false, message: "Debes ingresar sala_id, descripcion y prestamo_id para la anomalia."});
    }
    
    const response = await service.create({
      sala_id,
      prestamo_id,
      descripcion,
      usuario_id: req.uid
    });
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

module.exports = {
  getAll,
  create
};
