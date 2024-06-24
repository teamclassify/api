const AnomaliaService = require('../services/AnomaliaService');
const PrestamoService = require('../services/PrestamoService');
const UsuarioRolService = require('../services/UsuarioRolService');
const SalaService = require('../services/SalaService');
const sendEmail = require("../utils/sendEmail");
const service = new AnomaliaService();
const prestamoService = new PrestamoService();
const usuarioRolService = new UsuarioRolService();
const salaService = new SalaService();

const getAll = async (req, res) => {
  const filters = req.query.estado
    ? req.query.estado.split(",").map((itemState) => {
      return {
        name: "a.estado",
        value: itemState,
      };
    })
    : [];

  const description = req.query.descripcion ?? "";
  const page = req.query.page || 0;
  
  try {
    const count = await service.count(filters, description);
    const response = await service.find(filters, description, page);
    res.status(200).json({success: true, count: count[0]?.count ?? 0, data: response[0]});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const create = async (req, res) => {
  try {
    const { descripcion, prestamo_id } = req.body;
    
    if (descripcion === null || prestamo_id === null) {
      return res.status(400).send({success: false, message: "Debes ingresar descripcion y prestamo_id para la anomalia."});
    }
    
    const prestamo = await prestamoService.findOne(prestamo_id)

    if (!prestamo) {
      return res.status(404).send({success: false, message: "El prestamo no existe."});
    }
    
    const response = await service.create({
      sala_id: prestamo.sala_id,
      prestamo_id: prestamo.id,
      descripcion,
      usuario_id: req.uid
    });
    
    const sala = await salaService.findById(prestamo.sala_id);

    if (!sala) {
      return res.status(404).send({success: false, message: "No se encontro la sala de la anomalia."});
    }
    
    const usersSoporte = await usuarioRolService.findSoporte();

    console.log(usersSoporte)
    console.log(sala)
    
    await Promise.all(
      usersSoporte.map(async el => {
        return await sendEmail({
          to: el?.correo,
          subject: "Reporte de Anomalía | Préstamo de Salas",
          message: `
            <p>Nueva anomalia reportada en la sala ${sala.edificio} - ${sala.sala}</p>
            
            <p>Reporte:</p>
            <p>${descripcion}</p>
          `
        })
      })
    )
    
    res.status(201).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const update = async (req, res) => {
  try {
    const { id, estado } = req.body;

    if (estado === null || id === null) {
      return res.status(400).send({success: false, message: "Debes ingresar un id y estado para la anomalia."});
    }

    const response = await service.update(id, { estado });
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

module.exports = {
  getAll,
  create,
  update
};
