const StatsService = require('../services/StatsService');
const service = new StatsService();

const getLoansTotal = async (req, res) => {
  try {
    const response = await service.getLoansTotal();
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const getLoansByMonths = async (req, res) => {
  try {
    const response = await service.getLoansMonths();
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await service.getUsers();
    res.status(200).json({success: true, data: response});
  } catch (error) {
    res.status(500).send({success: false, message: error.message});
  }
};

module.exports = {
  getLoansTotal,
  getLoansByMonths,
  getUsers
};
