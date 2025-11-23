const routeStopRepository = require('../repository/RouteStopRepository');

const findStopsByRoute = async (routeId) => {
    const routeStops = await routeStopRepository.findStopsByRouteOrdered(routeId);
        
        return routeStops.map(rs => ({
            ...rs.stop,
            stop_order: rs.stop_order
        }));
}

const createRouteStopsForRoute = async (routeId, stops) => {
    routeStopRepository.createRouteStopsForRoute(routeId, stops);
}

module.exports = {
    findStopsByRoute,
    createRouteStopsForRoute,
}