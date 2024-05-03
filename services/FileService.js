const models = require("../db/models");
const ClaseService = require("../services/ClaseService");
const service = new ClaseService();

class FileService {
  constructor() {}

  async upload(data) {
    let tokens = [], info = [];
    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    for (let el in data) {
      let tmp = [];
      if(data[el].length > 0){
        tmp = data[el].map((x) =>{
          let diakey = []
          if(x['Alu max'] > 0){
            for (const key in x) {
              if (diasSemana.includes(key)) {
                info = x[key].split("\r\n")
                info.forEach(element => {
                  const dat = element.split(" ")
                  diakey.push({
                    dia: key, 
                    hora_inicio: parseInt(dat[0].slice(0,2)),
                    hora_fin: (dat[0][dat[0].length-2] != '0' ? parseInt(dat[0].slice(6,8)) + 1 : parseInt(dat[0].slice(6,8))),
                    sala: dat[1]
                  });
                });
              }
            }
            return {
              nombre: x['Nombre materia'],
              cod_asignatura: x['Codigo materia'].slice(0, x['Codigo materia'].length - 1),
              cod_docente: "0" + x['Cod prof'],
              grupo: x['Codigo materia'][x['Codigo materia'].length - 1],
              horario: diakey,
            }
          }
      }).filter(x => x);
      tokens = tokens.concat(tmp)
      }
    }
    return tokens;
  }

  async update(id, data) {
    
  }

  async delete(id) {
    
  }
}

module.exports = FileService;
