const FileService = require("../services/FileService");
const service = new FileService();

const upload = async (req, res) => {
    try {
      const response = await service.upload(req.body);
      res.json(req.file);
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