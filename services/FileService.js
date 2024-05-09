const ClaseService = require("../services/ClaseService");
const HorarioService = require("../services/HorarioService");
const DiaService = require("../services/DiaService");
const HoraService = require("../services/HoraService");
const EventoService = require("../services/EventoService");
const EdificioService = require("../services/EdificioService");
const SalaService = require("../services/SalaService");

const service = new ClaseService();
const horarioService = new HorarioService();
const diaService = new DiaService();
const horaService = new HoraService();
const eventoService = new EventoService();
const edificioService = new EdificioService();
const salaService = new SalaService();

class FileService {
  constructor() {}

  async uploadClases(data) {
    let clases = [];

    for (let el in data) {
      if (data[el].length > 0) {
        clases = clases.concat(this.getClases(data[el]));
      }
    }

    // Todas las clases creadas
    const clasesCreadas = [];

    return new Promise((resolve, reject) => {
      Promise.all(
        clases.map((element) => {
          return service.createFromExcel(element).then((clase) => {
            if (clase && clase.length > 0) {
              return Promise.all(
                element.horario.map((el) => {
                  const edificioName = el.sala.slice(0, 2);
                  const salaName = el.sala.slice(2, 5);

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
                                return horaService
                                  .create({
                                    dia_id: dia.id,
                                    hora_inicio: el.hora_inicio,
                                    hora_fin: el.hora_fin,
                                    evento_id: evento.id,
                                  })
                                  .then(() => {
                                    console.log("hora creada");
                                    clasesCreadas.push(clase[0]);
                                  });
                              });
                          }
                        });
                    });
                })
              );
            }
          });
        })
      )
        .then(() => {
          if (clasesCreadas.length === clases.length) {
            resolve({ clasesCreadas, message: "Clases creadas" });
          } else {
            reject(new Error("Error al crear clases"));
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
