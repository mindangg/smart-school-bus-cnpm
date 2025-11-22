const busRepository = require('../repository/BusRepository');
const routeAssigmentService = require('./RouteAssignmentService');

const getAllBuses = async () => {
    return busRepository.getAllBuses();
}

const getAvailableBuses = async () => {
    const allBuses = await busRepository.getAllBuses()
    const allAssignedRoutes = await routeAssigmentService.getRouteAssignments()

    const assignedBusIds = new Set(allAssignedRoutes.map(route => route.bus_id))
    return allBuses.filter(bus => !assignedBusIds.has(bus.bus_id))
}

const getTotalBuses = async () => {
    return busRepository.getTotalBuses();
}

const createBus = async (bus) => {
    return busRepository.createBus(bus);
}

const deleteBus = async (busId) => {
    return busRepository.deleteBus(busId);
}

module.exports = {
    getAllBuses,
    getAvailableBuses,
    getTotalBuses,
    createBus,
    deleteBus
};