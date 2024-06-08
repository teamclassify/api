const PrestamoService = require("../services/PrestamoService");
const EventoService = require("../services/EventoService");
const HoraService = require("../services/HoraService");
const HorarioService = require("../services/HorarioService");
const sendEmail = require("../utils/sendEmail");
const models = require("../db/models");

const service = new PrestamoService();
const eventoService = new EventoService();
const horaService = new HoraService();
const horarioService = new HorarioService();

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

const sendEmailLoanCanceled = async (req, res, loan) => {
  const loanInDB = await service.findOne(loan.id);

  if (!loanInDB) return;

  await sendEmail({
    to: loanInDB.usuario_correo,
    subject: "Cancelación de préstamo",
    message: `
        <p>Querido, ${loanInDB.usuario_nombre}</p>

        <p>Este correo electrónico confirma que se ha <strong>cancelado</strong> la reserva de la sala:</p>
        
        ${loanInDB.razon_cancelacion ? `<p>
          <strong>Razón de la cancelación</strong>: ${loanInDB.razon_cancelacion}
        </p>` : ''}

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
      `
  });
}

const sendEmailLoanAccepted = async (req, res, loan) => {
  const loanInDB = await service.findOne(loan.id);

  if (!loanInDB) return;

  await sendEmail({
    to: loanInDB.usuario_correo,
    subject: "Aceptación de préstamo",
    message: `
        <p>Querido, ${loanInDB.usuario_nombre}</p>

        <p>Este correo electrónico confirma que se ha <strong>aceptado</strong> la reserva de la sala:</p>

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
      .send({success: false, message: "Faltan datos del prestamo"});
  }

  try {
    const response = await service.create(req.body, req.uid);

    // send email to user
    await sendEmailLoan(req, res, response);

    res.json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
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
    res.status(200).json({sucess: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
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

    res.status(200).json({sucess: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const getAllPending = async (req, res) => {
  try {
    const response = await service.findAllPending();
    res.status(200).json({sucess: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const getById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await service.findOne(id);
    res.json(response);
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const update = async (req, res) => {
  try {
    // TODO: check the user owner
    const {id} = req.params;
    const body = req.body;
    const edificio = body.edificio
    const sala = body.sala
    const response = await service.update(id, body);

    const eventsInRange = await eventoService.findBySalaAndRangeHours(response.sala_id, response.fecha, response.hora_inicio, response.hora_fin);

    if (response?.estado !== 'CANCELADO' && eventsInRange.length > 0) {
      await service.update(id, {estado: 'PREAPROBADO'});
      return res.status(500).send({success: false, message: "No se puede crear un evento en este rango horario."});
    }

    // TODO: crear el evento
    if (response && response?.estado === 'APROBADO') {
      const evento = await eventoService.create({
        prestamo_id: response.id
      })

      const horarioElement = await horarioService.findBySala(edificio, sala)

      if (!horarioElement || horarioElement?.length <= 0) {
        return res.status(500).send({success: false, message: "Error al crear el evento del préstamo."});
      }

      const dias = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
      ];

      const dia = await models.Dia.create({
        nombre: dias[new Date(response.fecha.replaceAll('-', "/")).getDay()],
        fecha: response.fecha,
        horario_id: horarioElement[0].horario,
      })

      const hour = await models.Hora.create({
        dia_id: dia.id,
        hora_inicio: response.hora_inicio,
        hora_fin: response.hora_fin,
        evento_id: evento.id,
      });
    }

    if (response?.estado === 'CANCELADO') {
      // enviear email al usuario
      await sendEmailLoanCanceled(req, res, response);
    } else if (response?.estado === 'APROBADO') {
      await sendEmailLoanAccepted(req, res, response);
    }

    res.json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const _delete = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await service.delete(id);
    res.json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
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
