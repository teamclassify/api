const PrestamoService = require("../services/PrestamoService");
const sendEmail = require("../utils/sendEmail");

const service = new PrestamoService();

const sendEmailLoan = async (req, res, loan) => {
  const loanInDB = await service.findOne(loan.id);
  
  if (!loanInDB) return;
  
  await sendEmail({
    to: req.body.email,
    subject: "Petición de préstamo recibida",
    message: `
        <p>Querido, ${loanInDB.usuario_nombre}</p>

        <p>Este correo electrónico confirma que hemos recibido su solicitud para la siguiente reserva de sala:</p>

        <div class="info">
            <div class="flex">
              <label for="date">Fecha y hora: </label>
              <p id="date">${loanInDB.fecha} - ${loanInDB.hora_inicio} a ${loanInDB.hora_fin}</p>
            </div>

            <div class="flex">
              <label for="room">Sala: </label>
              <p id="room">${loanInDB.edificio} - ${loanInDB.sala}</p>
            </div>
            
            <div class="flex">
              <label for="reason">Razón: </label>
              <p id="reason">${loanInDB.razon}</p>
            </div>

            <div class="flex">
              <label for="equipment">Recursos necesarios: </label>
              <p id="equipment">${loanInDB.recursos}</p>
            </div>
            
            <div class="flex">
              <label for="equipment">Cantidad de personas que asistiran: </label>
              <p id="equipment">${loanInDB.cantidad_personas}</p>
            </div>
        </div>

        <p>Revisaremos su solicitud y nos comunicaremos con usted lo antes posible.</p>
      `
  });
}

const create = async (req, res) => {
  if (
    !req.body.razon ||
    !req.body.fecha ||
    !req.body.hora_fin ||
    !req.body.hora_inicio ||
    !req.body.cantidad_personas ||
    !req.body.sala_id ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send({ success: false, message: "Faltan datos del prestamo" });
  }

  try {
    const response = await service.create(req.body, req.uid);
    
    // send email to user
    await sendEmailLoan(req, res, response);
    
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const get = async (req, res) => {
  const filters = req.query.estado
    ? req.query.estado.split(",").map((itemState) => {
        return {
          name: "p.estado",
          value: itemState,
        };
      })
    : [];

  const reason = req.query.razon ?? "";

  try {
    const response = await service.findAllByFilters(filters, reason);
    res.status(200).json({ sucess: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const response = await service.findAllByFilters([
      {
        name: "u.id",
        value: req.uid,
      },
    ]);

    res.status(200).json({ sucess: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getAllPending = async (req, res) => {
  try {
    const response = await service.findAllPending();
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
  getByUser,
  getAllPending,
};
