const FileService = require("../services/FileService");
const excelToJson = require("../utils/excelToJson");
const { verifyIsAdmin } = require("../utils/verifyIsAdmin");

const service = new FileService();

const uploadClases = async (req, res) => {
  try {
    const [isAdmin, usuario_id] = await verifyIsAdmin(req.uid);

    if (isAdmin) {
      const excelData = excelToJson(req.file);
      let fileAllowed = true;

      // check if the excel file has the correct structure
      for (let el in excelData) {
        if (!fileAllowed) {
          break;
        }

        if (excelData[el].length > 0) {
          excelData[el].every((element) => {
            if (
              !element.hasOwnProperty("Codigo materia") ||
              !element.hasOwnProperty("Alu max") ||
              !element.hasOwnProperty("Alu mat") ||
              !element.hasOwnProperty("Nombre materia")
            ) {
              fileAllowed = false;
            }
          });
        }
      }

      if (!fileAllowed) {
        return res.status(400).json({
          success: false,
          data: "La estructura del archivo no es correcta",
        });
      }

      const response = await service.uploadClases(excelData, usuario_id);
      return res.json({ success: true, data: response });
    } else {
      return res
        .status(401)
        .json({ success: false, data: "Este usuario no tiene permisos" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const uploadSalas = async (req, res) => {
  try {
    const [isAdmin, usuario_id] = await verifyIsAdmin(req.uid);

    if (isAdmin) {
      const excelData = excelToJson(req.file);
      let fileAllowed = true;

      // check if the excel file has the correct structure
      for (let el in excelData) {
        if (!fileAllowed) {
          break;
        }

        if (excelData[el].length > 0) {
          excelData[el].every((element) => {
            if (
              !element.hasOwnProperty("Edificio") ||
              !element.hasOwnProperty("Sala") ||
              !element.hasOwnProperty("Capacidad") ||
              !element.hasOwnProperty("Cantidad Computadores")
            ) {
              fileAllowed = false;
            }
          });
        }
      }

      if (!fileAllowed) {
        return res.status(400).json({
          success: false,
          data: "La estructura del archivo no es correcta",
        });
      }

      const response = await service.uploadSalas(excelData, usuario_id);
      return res.json({ success: true, data: response });
    } else {
      return res
        .status(401)
        .json({ success: false, data: "Este usuario no tiene permisos" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const [isAdmin] = await verifyIsAdmin(req.uid);

    if (!isAdmin) {
      return res
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
    const [isAdmin] = await verifyIsAdmin(req.uid);

    if (!isAdmin) {
      return res
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
