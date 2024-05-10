const FileService = require("../services/FileService");
const excelToJson = require("../utils/excelToJson");
const UserService = require("../services/UserService");
const service = new FileService();
const userService = new UserService();

const uploadClases = async (req, res) => {
  try {
    const result = await userService.findOne(req.uid);
    if(result.rol_id === 2){
      const excelData = excelToJson(req.file);
      const response = await service.uploadClases(excelData);
      res.json({ success: true, data: response });
    }else{
      res.status(401).json({ success: false, data: "Este usuario no tiene permisos" }); 
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const uploadSalas = async (req, res) => {
  try {
    const result = await userService.findOne(req.uid);
    if(result.rol_id === 2){
      const excelData = excelToJson(req.file);
      const response = await service.uploadSalas(excelData);
      res.json({ success: true, data: response });
    }else{
      res.status(401).json({ success: false, data: "Este usuario no tiene permisos" }); 
    }
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
  uploadClases,
  uploadSalas,
  update,
  _delete,
};
