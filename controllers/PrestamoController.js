const PrestamoService = require("../services/PrestamoService");
const EventoService = require("../services/EventoService");
const HorarioService = require("../services/HorarioService");
const sendEmail = require("../utils/sendEmail");
const models = require("../db/models");

const service = new PrestamoService();
const eventoService = new EventoService();
const horarioService = new HorarioService();

const sendEmailLoan = async (req, res, loan) => {
  const loanInDB = loan?.id ? await service.findOne(loan.id) : await service.findOne(loan[0].prestamo_id)
  
  if (!loanInDB) return;

  await sendEmail({
    to: req.body.email,
    subject: "Petición de préstamo recibida",
    message: `
        <p>Cordial saludo, ${loanInDB.usuario_nombre}</p>
        
        ${loanInDB?.tipo === 'UNICO' ? `<p>
            Se ha realizado el registro de la sala: ${loanInDB.edificio} - ${loanInDB.sala} para el día ${loanInDB.fecha} - ${loanInDB.hora_inicio} a ${loanInDB.hora_fin}
        </p>` : `<div>
            <p>
            Se ha realizado el registro del préstamo semestral de la sala: ${loanInDB.edificio} - ${loanInDB.sala} para los días:
            </p>
            
            ${loanInDB?.dias?.split(',').map((dia, index) => `<p>
                ${dia.toUpperCase()} -
                ${loanInDB?.horas_inicio?.split(',')[index]}
                a ${loanInDB?.horas_fin?.split(',')[index]}
              </p>`).join(' ')}
            </div>
        `}
        
        <p>El personal de soporte analizará la disponibilidad y le será notificado el estado de su solicitud.</p>
      `
  });
}

const sendEmailLoanCanceled = async (req, res, loan) => {
  const loanInDB = loan?.id ? await service.findOne(loan.id) : null;

  if (!loanInDB) return;

  await sendEmail({
    to: loanInDB.usuario_correo,
    subject: "Cancelación de préstamo",
    message: `
        <p>Cordial saludo, ${loanInDB.usuario_nombre}</p>

        ${loanInDB?.tipo === 'UNICO' ? `<p>
            Se ha cancelado el préstamo de la sala: ${loanInDB.edificio} - ${loanInDB.sala} para el día ${loanInDB.fecha} - ${loanInDB.hora_inicio} a ${loanInDB.hora_fin}
        </p>` : `<div>
            <p>
            Se ha cancelado el préstamo semestral de la sala: ${loanInDB.edificio} - ${loanInDB.sala} para los días:
            </p>
            
            ${loanInDB?.dias?.split(',').map((dia, index) => `<p>
                ${dia.toUpperCase()} -
                ${loanInDB?.horas_inicio?.split(',')[index]}
                a ${loanInDB?.horas_fin?.split(',')[index]}
              </p>`).join(' ')}
            </div>
        `}
        
        ${loanInDB.razon_cancelacion ? `<p>
          <strong>Razón de la cancelación</strong>: ${loanInDB.razon_cancelacion}
        </p>` : ''}
      `
  });
}

const sendEmailLoanAccepted = async (req, res, loan) => {
  const loanInDB = loan?.id ? await service.findOne(loan.id) : null;

  if (!loanInDB) return;

  await sendEmail({
    to: loanInDB.usuario_correo,
    subject: "Aceptación de préstamo",
    message: `
        <p>Cordial saludo, ${loanInDB.usuario_nombre}</p>
        
        ${loanInDB?.tipo === 'UNICO' ? `<p>
            Se ha aceptado el préstamo de la sala: ${loanInDB.edificio} - ${loanInDB.sala} para el día ${loanInDB.fecha} - ${loanInDB.hora_inicio} a ${loanInDB.hora_fin}
        </p>` : `<div>
            <p>
            Se ha aceptado el préstamo semestral de la sala: ${loanInDB.edificio} - ${loanInDB.sala} para los días:
            </p>
            
            ${loanInDB?.dias?.split(',').map((dia, index) => `<p>
                ${dia.toUpperCase()} -
                ${loanInDB?.horas_inicio?.split(',')[index]}
                a ${loanInDB?.horas_fin?.split(',')[index]}
              </p>`).join(' ')}
            </div>
        `}
      `
  });
}

const create = async (req, res) => {
  if (
    !req.body.razon ||
    !req.body.sala_id ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send({success: false, message: "Faltan datos del préstamo"});
  }

  try {
    const response = await service.create(req.body, req.uid);
    
    if (response) await sendEmailLoan(req, res, response);
    return res.json({success: true, data: response});
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
  const page = req.query.page || 0;

  try {
    const count = await service.count(filters, reason);
    const response = await service.findAllByFilters(filters, reason, page);
    res.status(200).json({sucess: true, count: count[0]?.count ?? 0, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const getByUser = async (req, res) => {
  const page = req.query.page || 0;
  
  try {
    const filters = [
      {
        name: "u.id",
        value: req.uid,
      },
    ];
    
    const count = await service.count(filters, "");
    const response = await service.findAllByFilters(filters, "", page);

    res.status(200).json({sucess: true, count: count[0]?.count ?? 0, data: response});
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
      await service.update(id, {estado: 'PENDIENTE'});
      return res.status(500).send({success: false, message: "No se puede crear un evento en este rango horario."});
    }

    // TODO: crear el evento
    if (response && response?.estado === 'APROBADO') {
      if (response?.tipo === 'UNICO') {
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
      } else {
        const prestamo = await service.findOne(response?.id);
        const prestamoDias = prestamo?.dias?.split(',') ?? [];
        const prestamoHorasInicio = prestamo?.horas_inicio?.split(',') ?? [];
        const prestamoHorasFin = prestamo?.horas_fin?.split(',') ?? [];
        
        await Promise.all(
          prestamoDias.map(async (diaEl, index) => {
            const eventoPrestamo = await eventoService.create({
              prestamo_id: response.id
            })

            const horarioElementPrestamo = await horarioService.findBySala(edificio, sala)

            if (!horarioElementPrestamo || horarioElementPrestamo?.length <= 0) {
              return res.status(500).send({success: false, message: "Error al crear el evento del préstamo."});
            }

            const dia = await models.Dia.create({
              nombre: diaEl,
              fecha: null,
              horario_id: horarioElementPrestamo[0].horario,
            })

            const hour = await models.Hora.create({
              dia_id: dia.id,
              hora_inicio: prestamoHorasInicio[index],
              hora_fin: prestamoHorasFin[index],
              evento_id: eventoPrestamo.id,
            });
          })
        )
      }
      
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
