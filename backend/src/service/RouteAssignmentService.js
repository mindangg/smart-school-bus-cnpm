const routeAssignmentRepository = require('../repository/RouteAssignmentRepository');
const axios = require('axios');

const getRouteAssignments = async () => {
    return routeAssignmentRepository.getAllRouteAssignments();
}

const getRouteAssignmentById = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentById(id)
    if (!route)
        throw new Error('No route')

    return route
}
const getRouteAssignmentByDriver = async (id) => {
    const route = await routeAssignmentRepository.getRouteAssignmentByDriver(id)
    if (!route)
        throw new Error('No route')

    return route
}

module.exports = {
    getRouteAssignments,
    getRouteAssignmentById,
    getRouteAssignmentByDriver
}