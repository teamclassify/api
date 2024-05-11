const ClaseService = require("../services/ClaseService");
const HorarioService = require("../services/HorarioService");
const DiaService = require("../services/DiaService");
const HoraService = require("../services/HoraService");
const EventoService = require("../services/EventoService");
const EdificioService = require("../services/EdificioService");
const UsuarioRolService = require("../services/UsuarioRolService");
const SalaService = require("../services/SalaService");
const db = require("../db/index");
const models = require("../db/models");
const getCurrentDay = require("../utils/getCurrentDay");

const service = new ClaseService();
const horarioService = new HorarioService();
const diaService = new DiaService();
const horaService = new HoraService();
const eventoService = new EventoService();
const edificioService = new EdificioService();
const salaService = new SalaService();
const usuarioRolService = new UsuarioRolService();

class FileService {
  constructor() {
    this.currentDay = getCurrentDay();
  }

  async createClases(clases, usuario_id) {
    const clases_db_values = clases
      .map(
        (clase) =>
          `('DEFAULT','${clase.nombre}','${clase.cod_asignatura}','${clase.grupo}','${usuario_id}','APROBADO','${clase.cod_docente}','${this.currentDay}','${this.currentDay}')`
      )
      .join(", ");

    await db.query(`INSERT INTO clase VALUES ${clases_db_values}`);
  }

  getEventToCreate(clases, clasesInDB) {
    const eventsToCreate = [];

    clases.forEach((clase) => {
      clase.horario.forEach((horario) => {
        eventsToCreate.push({
          clase_id:
            clasesInDB.find(
              (x) => x.nombre === clase.nombre && x.grupo === clase.grupo
            )?.id || null,
          dia: horario.dia,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
          sala: horario.sala,
        });
      });
    });

    return eventsToCreate;
  }

  async uploadClases(data, usuario_id) {
    let clases = [];

    for (let el in data) {
      if (data[el].length > 0) {
        clases = clases.concat(this.getClases(data[el]));
      }
    }

    await this.createClases(clases, usuario_id);
    const clasesInDB = await service.find();
    const edificios = await edificioService.find();
    const salas = await salaService.find();
    const horarios = await horarioService.find();

    return new Promise((resolve, reject) => {
      Promise.all(
        clases.map((claseElement) => {
          for (let horarioElement of claseElement.horario) {
            const edificioName = horarioElement.sala.slice(0, 2);
            const salaName = horarioElement.sala.slice(2, 5);

            models.Evento.create({
              nombre: horarioElement.dia,
              clase_id:
                clasesInDB.find(
                  (x) =>
                    x.nombre === claseElement.nombre &&
                    x.grupo === claseElement.grupo
                )?.id || null,
            }).then((evento) => {
              const edificio = edificios.find((x) => x.nombre === edificioName);

              if (edificio) {
                const sala = salas.find(
                  (x) => x.nombre === salaName && x.edificio_id === edificio.id
                );

                if (sala) {
                  const horario = horarios.find((x) => x.sala_id === sala.id);

                  if (horario) {
                    models.Dia.create({
                      nombre: horarioElement.dia,
                      fecha: this.currentDay,
                      horario_id: horario.id,
                    }).then((dia) => {
                      models.Hora.create({
                        dia_id: dia.id,
                        hora_inicio: horarioElement.hora_inicio,
                        hora_fin: horarioElement.hora_fin,
                        evento_id: evento.id,
                      });
                    });
                  }
                }
              }
            });
          }
        })
      )
        .then(() => {
          resolve({ message: "Clases creadas" });
        })
        .catch((error) => {
          reject(error);
        });
    });

    // this.createClase(clases, usuario_id);
    // const clasesInDB = await service.find();
    // const edificios = await edificioService.find();
    // const salas = await salaService.find();
    // const horarios = await horarioService.find();

    // const eventsToCreate = this.getEventToCreate(clases, clasesInDB);
    // console.log(eventsToCreate);
    // this.createEvents(eventsToCreate, edificios, salas, horarios);

    // const eventosInDB = await eventoService.find();
    // console.log(eventosInDB);

    /*
    // Todas las clases creadas
    const clasesCreadas = {};

    return new Promise((resolve, reject) => {
      Promise.all(
        clases.map((element) => {
          return this.validarDisponibilidad(element).then((validos) => {
            return service.createFromExcel(element).then((clase) => {
              if (clase && clase.length > 0) {
                return Promise.all(
                  element.horario.map((el, index) => {
                    const edificioName = el.sala.slice(0, 2);
                    const salaName = el.sala.slice(2, 5);

                    // Verificar disponibilidad
                    if (!validos[index]) {
                      // Creacion del evento
                      return eventoService
                        .create({
                          nombre: el.dia,
                          clase_id: clase[0],
                        })
                        .then((evento) => {
                          return horarioService
                            .findBySala(edificioName, salaName)
                            .then((data) => {
                              if (data.length > 0) {
                                const horario = data[0].horario;

                                // Creacion del dia
                                return diaService
                                  .create({
                                    nombre: el.dia,
                                    fecha: new Date(),
                                    horario_id: horario,
                                  })
                                  .then((dia) => {
                                    // Creacion de hora
                                    return horaService.create({
                                      dia_id: dia.id,
                                      hora_inicio: el.hora_inicio,
                                      hora_fin: el.hora_fin,
                                      evento_id: evento.id,
                                    });
                                  });
                              }
                            });
                        });
                    }
                  })
                ).then(() => {
                  clasesCreadas[clase[0]] = [];
                });
              }
            });
          });
        })
      )
        .then(() => {
          resolve({ clases: clasesCreadas, message: "Clases creadas" });
        })
        .catch((error) => {
          reject(error);
        });
    });
    */
  }

  validarDisponibilidad(clase) {
    const horasVerificadas = [];

    return new Promise((resolve, reject) => {
      Promise.all(
        clase.horario.map((element) => {
          return db
            .query(
              `
                SELECT e.id
                FROM evento e
                CROSS JOIN (
                    SELECT h.evento_id
                    FROM horas h
                    WHERE (${element.hora_inicio} <= h.hora_inicio AND ${element.hora_fin} > h.hora_inicio)
                    OR (${element.hora_inicio} < h.hora_fin AND ${element.hora_fin} >= h.hora_fin)
                    OR (${element.hora_inicio} >= h.hora_inicio AND ${element.hora_fin} <= h.hora_fin)
                ) AS h_filtrado
                INNER JOIN dia d ON d.id = h_filtrado.evento_id
                INNER JOIN horarios ho ON ho.id = d.horario_id
                INNER JOIN salas s ON s.id = ho.sala_id
                INNER JOIN edificios ed ON ed.id = s.edificio_id;
              `
            )
            .then((results) => {
              horasVerificadas.push(results.length === 0);
            })
            .catch((error) => {
              console.log(error);
            });
        })
      )
        .then(() => {
          console.log(horasVerificadas);
          if (horasVerificadas.length === clase.horario.length) {
            resolve(horasVerificadas);
          } else {
            reject(new Error("Error al verificar las horas"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getClases(data) {
    const clases = data
      .map((x) => {
        if (x["Alu max"] > 0) {
          let dias = this.getDays(x);
          return {
            nombre: x["Nombre materia"],
            cod_asignatura: x["Codigo materia"].slice(
              0,
              x["Codigo materia"].length - 1
            ),
            cod_docente: "0" + (x["Cod prof"] ? x["Cod prof"] : ""),
            grupo: x["Codigo materia"][x["Codigo materia"].length - 1],
            horario: dias,
          };
        }
      })
      .filter((x) => x);

    return clases;
  }

  getDays(x) {
    const dias = [];
    const diasSemana = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
    ];

    for (const key in x) {
      if (diasSemana.includes(key)) {
        const info = x[key].split("\r\n");

        info.forEach((element) => {
          const dat = element.split(" ");

          dias.push({
            dia: key,
            hora_inicio: parseInt(dat[0].slice(0, 2)),
            hora_fin:
              dat[0][dat[0].length - 2] != "0"
                ? parseInt(dat[0].slice(6, 8)) + 1
                : parseInt(dat[0].slice(6, 8)),
            sala: dat[1],
          });
        });
      }
    }
    return dias;
  }

  async uploadSalas(data) {
    let salas = [];

    for (let element in data) {
      const salasData = data[element].map((x) => {
        return {
          nombre: x["Sala"],
          capacidad: x["Capacidad"],
          cantidad_computadores: x["Cantidad Computadores"],
          edificio: x["Edificio"],
        };
      });

      salas = salas.concat(salasData);

      let edificios = salas.map((x) => {
        return x.edificio;
      });

      edificios = [...new Set(edificios)];

      // Todas los horarios creados
      const edificiosCreados = [];
      const salasCreadas = [];

      return new Promise((resolveEdificio, rejectEdificio) => {
        Promise.all(
          edificios.map((edificio) => {
            return edificioService
              .create({
                nombre: edificio,
              })
              .then(() => edificiosCreados.push(edificio.id));
          })
        )
          .then(() => {
            return new Promise((resolve, reject) => {
              Promise.all(
                salas.map((sala) => {
                  return edificioService
                    .find({
                      nombre: sala.edificio,
                    })
                    .then((edificioObtened) => {
                      return salaService
                        .create({
                          nombre: sala.nombre,
                          capacidad: sala.capacidad,
                          cantidad_computadores: sala.cantidad_computadores,
                          edificio_id: edificioObtened[0].id,
                        })
                        .then((sala) => {
                          salasCreadas.push(sala.id);

                          return horarioService
                            .create({
                              sala_id: sala.id,
                            })
                            .then(() => {
                              console.log("horario creado");
                            });
                        });
                    });
                })
              )
                .then(() => {
                  console.log("salas: ", salas.length);
                  console.log("Sala creadsa: ", salasCreadas.length);
                  if (salasCreadas.length === salas.length) {
                    resolve({ salasCreadas, message: "Salas creadas" });
                  } else {
                    reject(new Error("Error al crear las salas"));
                  }
                })
                .catch((error) => {
                  reject(error);
                });
            });
          })
          .then(() => {
            console.log("Edificios: ", edificios.length);
            console.log("Edificios creados: ", edificiosCreados.length);
            if (edificiosCreados.length === edificios.length) {
              resolveEdificio({
                edificiosCreados,
                message: "Edificios creados",
              });
            } else {
              rejectEdificio(new Error("Error al crear las salas y edificios"));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  }

  async update(id, data) {}

  async delete(id) {}
}

module.exports = FileService;
