const busStopRepository = require('../repository/BusStopRepository');

const getAllBusStops = async () => {
    return busStopRepository.getAllBusStops();
}

module.exports = {
    getAllBusStops,
}