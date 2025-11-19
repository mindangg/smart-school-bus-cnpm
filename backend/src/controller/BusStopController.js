const busStopService = require('../service/BusStopService');

const getAllBusStops = async (req, res) => {
    try {
        const busStops = await busStopService.getAllBusStops();
        res.status(200).json(busStops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllBusStops,
};