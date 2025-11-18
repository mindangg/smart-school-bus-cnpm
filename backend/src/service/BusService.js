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

module.exports = {
    getAllBuses,
    getAvailableBuses
};