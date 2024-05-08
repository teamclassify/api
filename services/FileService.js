const ClaseService = require("../services/ClaseService");
const HorarioService = require("../services/HorarioService");
const DiaService = require("../services/DiaService");
const HoraService = require("../services/HoraService");
const EventoService = require("../services/EventoService");

const service = new ClaseService();
const horarioService = new HorarioService();
const diaService = new DiaService();
const horaService = new HoraService();
const eventoService = new EventoService();

class FileService {
  constructor() {}

  async upload(data) {
    let clases = [];
    for (let el in data) {
      if(data[el].length > 0){
        clases = clases.concat(this.getClases(data[el]));
      }
    }
    clases.forEach((element) => {
      service.createFromExcel(element).then(clase => {
        if (clase && clase.length > 0) {
          element.horario.forEach((el) => {
            const edificioName = el.sala.slice(0, 2)
            const salaName = el.sala.slice(2, 5)   
            // Creacion del evento
            eventoService.create({
              nombre: el.dia,
              clase_id: clase[0]
            }).then(evento => {
              horarioService.findBySala(edificioName, salaName).then(data => {
              if (data.length > 0) {
                const horario = data[0].horario
                // Creacion del dia
                diaService.create({
                  nombre: el.dia,
                  fecha: new Date(),
                  horario_id: horario
                }).then(dia => {
                  // Creacion de hora
                  horaService.create({
                    dia_id: dia.id,
                    hora_inicio: el.hora_inicio,
                    hora_fin: el.hora_fin,
                    evento_id: evento.id
                  }).then(hora => {
                    console.log("hora creada")
                  })
                })
              }
              })
            })
          });
        }
      })
    });
    return clases;
  }

  getClases(data){
    const clases = data.map((x) =>{
      if(x['Alu max'] > 0){
        let dias = this.getDays(x)
        return {
          nombre: x['Nombre materia'],
          cod_asignatura: x['Codigo materia'].slice(0, x['Codigo materia'].length - 1),
          cod_docente: "0" + (x['Cod prof'] ? x['Cod prof'] : ""),
          grupo: x['Codigo materia'][x['Codigo materia'].length - 1],
          horario: dias,
        }
      }
    }).filter(x => x)
    return clases
  }

  getDays(x){
    const dias= []
    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    for (const key in x) {
      if (diasSemana.includes(key)) {
        const info = x[key].split("\r\n")
        info.forEach(element => {
          const dat = element.split(" ")
          dias.push({
            dia: key,
            hora_inicio: parseInt(dat[0].slice(0,2)),
            hora_fin: (dat[0][dat[0].length-2] != '0' ? parseInt(dat[0].slice(6,8)) + 1 : parseInt(dat[0].slice(6,8))),
            sala: dat[1]
          });
        });
      }
    }
    return dias
  }

  async update(id, data) {
    
  }

  async delete(id) {
    
  }
}

module.exports = FileService;
