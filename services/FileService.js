const models = require("../db/models");
const ClaseService = require("../services/ClaseService");
const service = new ClaseService();

class FileService {
  constructor() {}

  async upload(data) {
    let tokens = [], diakey = '', info = [];
    const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    for (let el in data) {
      let tmp = [];
      if(data[el].length > 0){
        tmp = data[el].map((x) =>{
          if(x['Alu max'] > 0){
            for (const key in x) {
              if (diasSemana.includes(key)) {
                diakey = key
                info = x[key].split(" ");
              }
            }
            return {
              nombre: x['Nombre materia'],
              cod_asignatura: x['Codigo materia'].slice(0, x['Codigo materia'].length - 1),
              cod_docente: "0" + x['Cod prof'],
              grupo: x['Codigo materia'][x['Codigo materia'].length - 1],
              horario:{
                dia: diakey, 
                hora_inicio: parseInt(info[0].slice(0,2)),
                hora_fin: (info[0][info[0].length-2] != '0' ? parseInt(info[0].slice(6,8)) + 1 : parseInt(info[0].slice(6,8))),
                sala: info[1]
              },
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
