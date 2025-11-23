const AdminService = require('../service/AdminService');

const getDashboardStats = async (req, res) => {
    try {
        const stats = await AdminService.getDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};