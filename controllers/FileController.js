const FileService = require("../services/FileService");
const excelToJson = require("../utils/excelToJson");
const RolService = require("../services/RolService");
const UsuarioRolService = require("../services/UsuarioRolService");

const service = new FileService();
const usuarioRolService = new UsuarioRolService();
const rolService = new RolService();

const verifyIsAdmin = async (req) => {
  const rolAdmin = await rolService.find({ nombre: "admin" });

  if (rolAdmin.length === 0) {
    return false;
  }

  const results = await usuarioRolService.find({
    usuario_id: req.uid,
    rol_id: rolAdmin[0].id,
  });

  return results.length > 0;
};

const uploadClases = async (req, res) => {
  try {
    const isAdmin = await verifyIsAdmin(req);

    if (isAdmin) {
      const excelData = excelToJson(req.file);
      const response = await service.uploadClases(excelData);
      res.json({ success: true, data: response });
    } else {
      res
        .status(401)
        .json({ success: false, data: "Este usuario no tiene permisos" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const uploadSalas = async (req, res) => {
  try {
    const isAdmin = await verifyIsAdmin(req);

    if (isAdmin) {
      const excelData = excelToJson(req.file);
      const response = await service.uploadSalas(excelData);
      res.json({ success: true, data: response });
    } else {
      res
        .status(401)
        .json({ success: false, data: "Este usuario no tiene permisos" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const isAdmin = await verifyIsAdmin(req);

    if (!isAdmin) {
      res
        .status(401)
        .json({ success: false, data: "Este usuario no tiene permisos" });
    }

    const response = await service.update(req.body);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const _delete = async (req, res) => {
  try {
    const isAdmin = await verifyIsAdmin(req);

    if (!isAdmin) {
      res
        .status(401)
        .json({ success: false, data: "Este usuario no tiene permisos" });
    }

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
