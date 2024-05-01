const FileService = require("../services/FileService");
const excelToJson = require("convert-excel-to-json");
const service = new FileService();

const upload = async (req, res) => {
    try {
      const excelData = excelToJson({
        sourceFile: "./uploads/horario.xlsx",
        header: {
          rows: 1
        },
        columnToKey: {
          F: 'nombre',
          A: 'cod_asignatura',
          D: 'cod_docente',
          O: 'grupo',
          P: 'estado_id'
        },
      });
      const response = await service.upload(excelData);
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
      const response = await service.update(req.body);
  
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

const _delete = async (req, res) => {
    try {
      const response = await service.delete(req.body);
  
      res.json({ success: true, data: response });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
};

module.exports = {
  upload,
  update,
  _delete,
};