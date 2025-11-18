const busService = require('../service/BusService');

const getAllBuses = async (req, res) => {
    const {isAvailable} = req.query;
    try {
        if (isAvailable) {
            const allBuses = await busService.getAvailableBuses();
            res.status(200).json(allBuses);
            return;
        }
        const buses = await busService.getAllBuses();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllBuses,
};