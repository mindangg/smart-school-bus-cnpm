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

const createBus = async (req, res) => {
    const busData = req.body;
    try {
        const newBus = await busService.createBus(busData);
        res.status(201).json(newBus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteBus = async (req, res) => {
    const busId = req.params.id;
    if (busId === undefined) {
        return res.status(400).json({ message: 'Bus ID is required' });
    }
    try {
        await busService.deleteBus(Number(busId));
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllBuses,
    createBus,
    deleteBus
};